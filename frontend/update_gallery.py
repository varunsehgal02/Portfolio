import re

with open('/home/noob/Downloads/Portfolio/frontend/src/app/projects/page.js', 'r') as f:
    content = f.read()

# Define the new array string
new_gallery = """const ID_CARDS_GALLERY = [
    { front: "/projects/real-id-cards/1-front.png?v=2", back: "/projects/real-id-cards/1-back.png?v=2", fitMode: "contain" },
    { front: "/projects/real-id-cards/2-front.png?v=2", back: "/projects/real-id-cards/2-back.png?v=2", fitMode: "contain" },
    { front: "/projects/real-id-cards/3-front.png?v=2", back: "/projects/real-id-cards/3-back.png?v=2", fitMode: "contain" },
    { front: "/projects/real-id-cards/4-front.png?v=2", back: "/projects/real-id-cards/4-back.png?v=2", fitMode: "contain" },
    { front: "/projects/omesh/1v.png?v=2", back: "/projects/omesh/2v.png?v=2", fitMode: "stretch" },
    { front: "/projects/omesh/3v.png?v=2", back: "/projects/omesh/4v.png?v=2", fitMode: "contain" },
    { front: "/projects/omesh/5v.png?v=2", back: "/projects/omesh/6v.png?v=2", fitMode: "stretch" },
    { front: "/projects/omesh/7v.png?v=2", back: "/projects/omesh/8v.png?v=2", fitMode: "stretch" },
    { front: "/projects/omesh/9v.png?v=2", back: "/projects/omesh/10v.png?v=2", fitMode: "stretch" },
    { front: "/projects/omesh/11v.png?v=2", back: "/projects/omesh/12v.png?v=2", fitMode: "stretch" },
    { front: "/projects/omesh/13v.png?v=2", back: "/projects/omesh/14v.png?v=2", fitMode: "stretch" },
    { front: "/projects/omesh/15v.png?v=2", back: "/projects/omesh/16v.png?v=2", fitMode: "stretch" },
];"""

# Replace the block
pattern = re.compile(r'const ID_CARDS_GALLERY = \[.*?\];', re.DOTALL)
new_content = pattern.sub(new_gallery, content)

with open('/home/noob/Downloads/Portfolio/frontend/src/app/projects/page.js', 'w') as f:
    f.write(new_content)
