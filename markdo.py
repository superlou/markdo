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
            current_section = next(item for item in reversed(item_stack)
                                   if isinstance(item, Section))

            # Get info to determine line type
            section_level = lcount(line, "#")
            is_section_start = section_level > 0
            
            task_start_matches = task_start_pattern.match(line)
            is_task_start = task_start_matches is not None
            if is_task_start:
                if task_start_matches.group(1):
                    leading_whitespace = task_start_matches.group(1)
                    task_level = len(leading_whitespace)
                else:
                    task_level = 0        
            else:
                task_level = None    

            # Apply the info to create new items
            if is_section_start:
                if section_level > current_section.level:
                    section = current_section.create_child_section(line, section_level, line_num)
                elif section_level == current_section.level:
                    parent = current_section.parent
                    section = parent.create_child_section(line, section_level, line_num)
                elif section_level < section.level:
                    parent = current_section.parent.parent
                    section = parent.create_child_section(line, section_level, line_num)
                    
                item_stack.append(section)
            
            elif is_task_start:
                last_item = item_stack[-1]

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

                title = Task.parse_title(line)
                task = parent.create_child_task(title, task_level)
                item_stack.append(task)

            elif line.strip() == "":
                continue
            else:
                current_section.children.append(Note(line))

        self.root = root

class Section:
    def __init__(self, title: str, level: int, line_num=None):
        self.title = title
        self.level = level
        self.line_num = line_num
        self.children = []
        self.parent = None

    def create_child_section(self, title: str, level: int, line_num=None):
        child = Section(title, level, line_num)
        child.parent = self
        self.children.append(child)
        return child
    
    def create_child_task(self, title: str, level: int, line_num=None):
        child = Task(title, level, line_num)
        child.parent = self
        self.children.append(child)
        return child


task_start_pattern = re.compile(r"(\s)*\[[ \w]\]")


class Task:
    def __init__(self, title: str, level: int, line_num=None):
        self.title = title
        self.level = level
        self.line_num = line_num
        self.children = []
        self.parent = None
    
    def create_child_task(self, title: str, level: int, line_num=None):
        child = Task(title, level, line_num)
        child.parent = self
        self.children.append(child)
        return child

    def parse_title(text:str) -> str:
        end_box_pos = text.find("]")
        text = text[end_box_pos + 1:].strip()
        return text



class Note:
    def __init__(self, text: str):
        self.text = text


def lcount(text: str, pattern: str) -> int:
    return len(text) - len(text.lstrip(pattern))