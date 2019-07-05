/* eslint-disable */
/**
 * Modified version of Jake Gordon's Bin Packing algorithm used for Filterizr's 'packed' layout
 * @see {@link https://github.com/jakesgordon/bin-packing}
 */
interface PackerRoot {
  x: number;
  y: number;
  w: number;
  h?: number;
  used?: boolean;
  down?: PackerRoot;
  right?: PackerRoot;
}

interface PackerBlock {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  fit?: PackerRoot | void;
}

export default class Packer {
  root: PackerRoot;

  constructor(w: number) {
    this.init(w);
  }

  init(w: number) {
    this.root = { x: 0, y: 0, w: w };
  }

  fit(blocks: PackerBlock[]) {
    let n,
      node,
      block,
      len = blocks.length;
    let h = len > 0 ? blocks[0].h : 0;
    this.root.h = h;
    for (n = 0; n < len; n++) {
      block = blocks[n];
      if ((node = this.findNode(this.root, block.w, block.h)))
        block.fit = this.splitNode(node, block.w, block.h);
      else block.fit = this.growDown(block.w, block.h);
    }
  }

  findNode(root: PackerRoot, w: number, h: number): PackerRoot | void {
    if (root.used)
      return this.findNode(root.right, w, h) || this.findNode(root.down, w, h);
    else if (w <= root.w && h <= root.h) return root;
    else return null;
  }

  splitNode(node: PackerRoot, w: number, h: number): PackerRoot {
    node.used = true;
    node.down = { x: node.x, y: node.y + h, w: node.w, h: node.h - h };
    node.right = { x: node.x + w, y: node.y, w: node.w - w, h: h };
    return node;
  }

  growDown(w: number, h: number): PackerRoot | void {
    let node;
    this.root = {
      used: true,
      x: 0,
      y: 0,
      w: this.root.w,
      h: this.root.h + h,
      down: { x: 0, y: this.root.h, w: this.root.w, h: h },
      right: this.root,
    };
    if ((node = this.findNode(this.root, w, h)))
      return this.splitNode(node, w, h);
    else return null;
  }
}
