class DomElement {
  private elements: any[] | NodeListOf<HTMLElement>; //The actual DOM element
  constructor(selector: string) {
    if (selector === 'document') {
      this.elements = [document];
    } else if (selector === 'window') {
      this.elements = [window];
    } else {
      this.elements = (selector.length) ? Array.prototype.slice.call(document.querySelectorAll(selector)) : new Array(selector);
    }
  }

  each(callback: Function, fncallback?: Function) {
    if (!callback || typeof callback !== 'function') return;
    for (let i in this.elements) {
      callback(this.elements[i], i);
    }
    if (typeof fncallback === 'function') fncallback();
    return this;
  };

  addClass(className: string) {
    const classList = className.split(' ');
    this.each((item: HTMLElement) => {
      item.classList.add(...classList);
    });
    return this;
  }

  trigger(event: any) {
    this.each((item: HTMLElement) => {
      setTimeout(() => {
        item.dispatchEvent(new Event(event));
      })
    });
  }

  removeClass(className: string) {
    const classList = className.split(' ');
    this.each((item: HTMLElement) => {
      item.classList.remove(...classList);
    });
    return this;
  };

  on(event: any, callback: (this: HTMLElement, ev: any) => any) {
    this.each((item: HTMLElement) => {
      item.addEventListener(event, callback);
    });
    return this;
  }

  find(selector: any) {
    this.each((item: HTMLElement) => {
      this.elements = item.querySelectorAll(selector);
    });
    return this;
  }

  attr(key: string, val?: string) {
    let ttVal;
    this.each((item: HTMLElement) => {
      (!val) ? ttVal = item.getAttribute(key) : ttVal = item.setAttribute(key, val)
    });
    return ttVal;
  }

  html(node: any) {
    this.each((item: HTMLElement) => {
      item.innerHTML = node;
    });
    return this;
  }

  parent() {
    const parentNode: ((Node & ParentNode) | null)[] = [];
    this.each((item: HTMLElement) => {
      parentNode.push(item.parentNode);
    });
    this.elements = parentNode;
    return this;
  }

  siblings() {

    let siblings: ChildNode[] = [];
    this.each((item: HTMLElement) => {
      let sibling = item.parentNode ?.firstChild;
      for (; sibling; sibling = sibling.nextSibling) {
        if (sibling.nodeType !== 1 || sibling === item) continue;
        siblings.push(sibling);
      }
    });
    this.elements = siblings;
    return this;
  }

  after(elem: any) {
    this.each((item: HTMLElement) => {
      item.insertAdjacentHTML('afterend', elem)
    });
    return this;
  }

  remove() {
    this.each((item: HTMLElement) => {
      item.remove();
    });
    return this;
  }

}

export const _s = (selector: any) => {
  const el = new DomElement(selector);
  return el;
}
