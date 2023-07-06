from markdo import Markdo, Section, Task, Note, print_tree


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
    Some descriptive text.
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
    assert markdo.root.children[0].children[1].children[1].title == "Task 2.1"
    assert markdo.root.children[0].children[2].title == "Task 3"
    assert markdo.root.children[1].children[0].children[0].title == "Task 3"


def test_task_completion():
    text = """
[x] Task 0
[ ] Task 1
    Some descriptive text.
    [ ] Task 1.1
    [x] Task 1.2
    [ ] Task 1.3
[ ] Task 2
    [x] Task 2.1
    [x] Task 2.2
[ ] Task 3
"""

    markdo = Markdo(text)
    root = markdo.root
    assert root.children[0].is_open == False
    assert len(root.children[0].subtasks()) == 0

    assert root.children[1].is_open == True
    assert len(root.children[1].subtasks()) == 3
    assert len(root.children[1].subtasks(open=True)) == 2
    assert len(root.children[1].subtasks(open=False)) == 1

    assert root.children[2].is_open == True
    assert len(root.children[2].subtasks()) == 2
    assert len(root.children[2].subtasks(open=True)) == 0
    assert len(root.children[2].subtasks(open=False)) == 2

    assert root.children[3].is_open == True