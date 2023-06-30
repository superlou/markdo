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