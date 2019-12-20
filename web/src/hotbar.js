import { SIZE } from "./constants";

// Eine Leiste mit Gegenständen
// Beim Spielen sind hier gesammelte Items, im Bearbeitungsmodus gibt es eine Auswahl an Blöcken und Entities
class Hotbar {
  constructor(getSprite, onSelect) {
    this.items = [];
    this.getSprite = getSprite;
    this.onSelect = onSelect;

    this.spacing = 20;
    this.itemSpacing = 10;
    this.itemSize = 1.5;

    this.yOffset = 10;
    this.selectedItemIndex = 0;
  }

  get x() {
    const numItems = this.items.length;
    const width = (this.itemSize * SIZE + this.itemSpacing) * numItems - this.itemSpacing;
    return windowWidth / 2 - (width + this.spacing) / 2;
  }

  get y() {
    const height = this.itemSize * SIZE;
    const yOffset = 10;
    return windowHeight - (height + this.spacing) - yOffset;
  }

  get innerWidth() {
    const numItems = this.items.length;
    return (this.itemSize * SIZE + this.itemSpacing) * numItems - this.itemSpacing;
  }

  get width() {
    return this.innerWidth + this.spacing;
  }

  get innerHeight() {
    return this.itemSize * SIZE;
  }

  get height() {
    return this.innerHeight + this.spacing;
  }

  // Prüft, ob sich die Maus in der Leiste befindet.
  get isMouseInHotbar() {
    const x = this.x;
    const y = this.y;
    const width = this.width;
    const height = this.height;
    return mouseX > x && mouseX < x + width && mouseY > y && mouseY < y + height;
  }

  get selectedItem() {
    return this.items[this.selectedItemIndex];
  }

  input() {
    if (keyIsDown(49)) {
      this.selectedItemIndex = 0;
      if (this.onSelect) this.onSelect(this.selectedItem, this.selectedItemIndex);
    } else if (keyIsDown(50)) {
      this.selectedItemIndex = 1;
      if (this.onSelect) this.onSelect(this.selectedItem, this.selectedItemIndex);
    } else if (keyIsDown(51)) {
      this.selectedItemIndex = 2;
      if (this.onSelect) this.onSelect(this.selectedItem, this.selectedItemIndex);
    } else if (keyIsDown(52)) {
      this.selectedItemIndex = 3;
      if (this.onSelect) this.onSelect(this.selectedItem, this.selectedItemIndex);
    } else if (keyIsDown(53)) {
      this.selectedItemIndex = 4;
      if (this.onSelect) this.onSelect(this.selectedItem, this.selectedItemIndex);
    } else if (keyIsDown(54)) {
      this.selectedItemIndex = 5;
      if (this.onSelect) this.onSelect(this.selectedItem, this.selectedItemIndex);
    } else if (keyIsDown(55)) {
      this.selectedItemIndex = 6;
      if (this.onSelect) this.onSelect(this.selectedItem, this.selectedItemIndex);
    } else if (keyIsDown(56)) {
      this.selectedItemIndex = 7;
      if (this.onSelect) this.onSelect(this.selectedItem, this.selectedItemIndex);
    } else if (keyIsDown(57)) {
      this.selectedItemIndex = 8;
      if (this.onSelect) this.onSelect(this.selectedItem, this.selectedItemIndex);
    } else if (keyIsDown(48)) {
      this.selectedItemIndex = 9;
      if (this.onSelect) this.onSelect(this.selectedItem, this.selectedItemIndex);
    }

    if (mouseIsPressed) {
      this.items.forEach((item, i) => {
        const blockX =
          windowWidth / 2 - this.innerWidth / 2 + i * (this.itemSize * SIZE + this.itemSpacing);
        const blockY = windowHeight - this.innerHeight - this.yOffset - this.spacing / 2;
        if (
          mouseX > blockX &&
          mouseY > blockY &&
          mouseX < blockX + this.itemSize * SIZE &&
          mouseY < blockY + this.itemSize * SIZE
        ) {
          this.selectedItemIndex = i;
          if (this.onSelect) this.onSelect(item, i);
        }
      });
    }
  }

  draw() {
    stroke("#000");
    fill("#fff");
    rect(this.x, this.y, this.width, this.height, 20);
    this.items.forEach((item, i) => {
      image(
        this.getSprite(item, i),
        windowWidth / 2 - this.innerWidth / 2 + i * (this.itemSize * SIZE + this.itemSpacing),
        windowHeight - this.innerHeight - this.yOffset - this.spacing / 2,
        this.itemSize * SIZE,
        this.itemSize * SIZE
      );
      // Zeichnet den Rahmen um das ausgewählte Item
      if (i === this.selectedItemIndex) {
        push();
        fill("#00000000");
        strokeWeight(5);
        rect(
          windowWidth / 2 - this.innerWidth / 2 + i * (this.itemSize * SIZE + this.itemSpacing),
          windowHeight - this.innerHeight - this.yOffset - this.spacing / 2,
          this.itemSize * SIZE,
          this.itemSize * SIZE
        );
        pop();
      }
    });
  }
}

export default Hotbar;
