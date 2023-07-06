import re


class Markdo:
    def __init__(self, text: str):
        self.text = text
        self.parse()

    def parse(self):
        section = None
        task = None
        item_stack = []

        lines = self.text.splitlines()

        root = Section("root", 0)
        item_stack.append(root)

        for line_num, line in enumerate(lines):
            # Get info to determine line type
            section_level = lcount(line, "#")
            is_section_start = section_level > 0

            task_start_matches = Task.start_pattern.match(line)
            is_task_start = task_start_matches is not None
            if is_task_start:
                if task_start_matches.group(1):
                    leading_whitespace = task_start_matches.group(1)
                    task_level = len(leading_whitespace)
                else:
                    task_level = 0
            else:
                task_level = None

            last_item = item_stack[-1]
            last_section = next(item for item in reversed(item_stack)
                                if isinstance(item, Section))

            # Apply the info to create new items
            if is_section_start:
                if section_level == last_section.level:
                    parent = last_section.parent
                elif section_level > last_section.level:
                    parent = last_section
                elif section_level < section.level:
                    parent = last_section.parent.parent

                title = Section.parse_title(line)
                section = parent.create_child_section(
                    title, section_level, line_num)
                item_stack.append(section)

            elif is_task_start:
                if isinstance(last_item, Section):
                    parent = last_item
                elif isinstance(last_item, Task) and task_level == last_item.level:
                    parent = last_item.parent
                elif isinstance(last_item, Task) and task_level > last_item.level:
                    parent = last_item
                elif isinstance(last_item, Task) and task_level < last_item.level:
                    parent = last_item.parent.parent
                else:
                    print("Couldn't determine Task parent!")
                    continue

                task = Task.from_start_line(line, task_level, line_num)
                parent.add_child_task(task)
                item_stack.append(task)

            elif line.strip() == "":
                continue
            else:
                last_item.children.append(Note(line.strip()))

        self.root = root


class TaskContainer:
    def add_child_task(self, child):
        child.parent = self
        self.children.append(child)
        return child


class SectionContainer:
    def create_child_section(self, title: str, level: int, line_num=None):
        child = Section(title, level, line_num)
        child.parent = self
        self.children.append(child)
        return child


class Section(SectionContainer, TaskContainer):
    def __init__(self, title: str, level: int, line_num=None):
        self.title = title
        self.level = level
        self.line_num = line_num
        self.children = []
        self.parent = None

    def parse_title(text: str) -> str:
        last_pound = lcount(text, "#")
        text = text[last_pound + 1:].strip()
        return text


class Task(TaskContainer):
    start_pattern = re.compile(r"(\s)*\[([ \w]+)\]")

    def __init__(self, title: str, level: int, is_open: bool, line_num=None):
        self.title = title
        self.level = level
        self.is_open = is_open
        self.line_num = line_num
        self.children = []
        self.parent = None

    def from_start_line(text: str, level: int, line_num=None):
        title = Task.parse_title(text)

        matches = Task.start_pattern.match(text)
        is_open = matches.group(2).lower() != "x"

        return Task(title, level, is_open, line_num)

    def parse_title(text: str) -> str:
        end_box_pos = text.find("]")
        text = text[end_box_pos + 1:].strip()
        return text

    def subtasks(self, open=None):
        if open is None:
            return [child for child in self.children if isinstance(child, Task)]
        else:
            return [child for child in self.children
                    if isinstance(child, Task) and child.is_open == open]


class Note:
    def __init__(self, text: str):
        self.text = text


def lcount(text: str, pattern: str) -> int:
    return len(text) - len(text.lstrip(pattern))


def print_tree(item, level=0):
    if isinstance(item, Section):
        desc = item.title
    elif isinstance(item, Task):
        desc = item.title
    elif isinstance(item, Note):
        desc = item.text

    print("-" * level, desc)
    if hasattr(item, "children"):
        for child in item.children:
            print_tree(child, level + 1)