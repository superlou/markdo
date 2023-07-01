from markdo import Markdo


def test_section_parsing():
    text = """
# Heading 1
# Heading 2
## Heading 2.1
## Heading 2.2
# Heading 3
## Heading 3.1
"""

    markdo = Markdo(text)
    assert markdo.root is not None
    root = markdo.root
    assert len(root.children) == 3
    assert len(root.children[0].children) == 0
    assert len(root.children[1].children) == 2
    assert len(root.children[2].children) == 1


def test_tasks_and_subtask_parsing():
    text = """
# Heading 1
[ ] Task 1
[ ] Task 2
    [ ] Task 2.1
[ ] Task 3
# Heading 2
## Heading 2.1
[ ] Task 3
"""

    markdo = Markdo(text)
    print_tree(markdo.root)
    assert len(markdo.root.children[0].children) == 3
    assert markdo.root.children[0].children[0].title == "Task 1"
    assert markdo.root.children[0].children[1].title == "Task 2"
    assert markdo.root.children[0].children[1].children[0].title == "Task 2.1"
    assert markdo.root.children[0].children[2].title == "Task 3"
    assert markdo.root.children[1].children[0].children[0].title == "Task 3"


def print_tree(item, level=0):
    print("-" * level, item.title)
    for child in item.children:
        print_tree(child, level + 1)