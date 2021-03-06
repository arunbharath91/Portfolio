import { _s } from "./helper";

export class Portfolio {
  private selector: string;
  private filterActive!: string;
  private sliderUrls!: string[];
  private currentSlide!: string;
  constructor(selector: string) {
    this.selector = selector;
    this.initPortfolio();
  }

  initPortfolio() {
    _s(`${this.selector} .fil-btn.active`).trigger('click');

    _s(`${this.selector} .fil-btn`).on('click', (e) => {
      this.filterButton(e.target);
    });
    _s(`${this.selector}`).after('<div class="ajax-view-cdk"></div>');
    this.lightboxViewer();
    this.navEventRegistration();
  }

  protected filterButton(elem: HTMLElement) {
    this.filterActive = _s(elem).attr("data-rel") as unknown as string;
    _s(elem).addClass('active').siblings().removeClass('active');
    this.filter();
  }

  protected filter() {
    _s(`${this.selector} .portfolio-item`).removeClass('d-block');
    setTimeout(() => {
      _s(`${this.selector} .${this.filterActive}`).parent().addClass('d-block');
    }, 10);
  }

  private lightboxViewer() {
    const that = this;
    _s(`${this.selector} .item`).on('click', function (e) {
      e.preventDefault();
      that.lightboxConfig(this.getAttribute('data-href') as string);
    });
  }

  private lightboxConfig(dataHref: string) {
    this.currentSlide = dataHref;
    this.sliderUrls = [];
    _s(`${this.selector} .${this.filterActive}`).each((item: HTMLElement) => {
      this.sliderUrls.push(item.getAttribute('data-href') as string);
    },
      () => {
        this.httpReq(`${dataHref}`, {
          mode: 'no-cors',
          method: 'get'
        })
      });

  }

  private navEventRegistration() {
    _s('.ajax-view-cdk').on('click', (e: any) => {
      if (e.target && e.target.className == 'port-close') {
        document.body.style.overflowY = 'auto';
        _s(`${this.selector} + .ajax-view-cdk > .ajax-view`).remove();
      } else if (e.target && e.target.className == 'port-next') {
        let nextIndex = this.sliderUrls.indexOf(this.currentSlide) + 1;
        if (nextIndex >= this.sliderUrls.length) {
          nextIndex = 0;
        }
        this.currentSlide = this.sliderUrls[nextIndex];
        this.httpReq(`${this.currentSlide}`, {
          mode: 'no-cors',
          method: 'get'
        });
      } else if (e.target && e.target.className == 'port-prev') {
        let prevIndex = this.sliderUrls.indexOf(this.currentSlide) - 1;
        if (prevIndex < 0) {
          prevIndex = this.sliderUrls.length - 1;
        }
        this.currentSlide = this.sliderUrls[prevIndex];
        this.httpReq(`${this.currentSlide}`, {
          mode: 'no-cors',
          method: 'get'
        });
      }
      e.stopPropagation();
    });
  }


  protected httpReq(url: RequestInfo, methods: RequestInit) {
    this.setViewContainer();
    fetch(url, methods)
      .then((response) => {
        response.text().then((text) => {
          _s(`${this.selector} + .ajax-view-cdk > .ajax-view > .view-container`).html(`${text}`);
        });
      })
      .catch((err) => {
        console.log(err)
      });
  }

  private setViewContainer() {
    if (!document.querySelector(`.ajax-view`)) {
      document.body.style.overflowY = 'hidden';
      _s(`${this.selector} + .ajax-view-cdk`).html(`
      <div class="ajax-view animated fadeIn">
      <div class="port-nav">
          <button type="button" class="port-prev" title="previous">prev</button>
          <button type="button" class="port-close" title="close">close</button>
          <button type="button" class="port-next" title="next">next</button>
      </div>
      <div class="view-container">
      </div>

      </div>`);
    }
    _s(`${this.selector} + .ajax-view-cdk > .ajax-view > .view-container`).html(`<div class="loader"></div>`)
  }
}
