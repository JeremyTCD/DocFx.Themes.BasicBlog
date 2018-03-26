﻿import { injectable, inject } from 'inversify';
import RootComponent from '../shared/rootComponent';
import TooltipService from '../shared/tooltipService';
import * as Clipboard from 'clipboard';
import ArticleService from '../shared/articleService';

@injectable()
export default class ArticleComponent extends RootComponent {
    private _tooltipService: TooltipService;
    private _articleService: ArticleService;

    public constructor(tooltipService: TooltipService,
        articleService: ArticleService) {
        super();

        this._articleService = articleService;
        this._tooltipService = tooltipService;
    }

    public enabled(): boolean {
        // Always exists
        return true;
    }

    public setupImmediate(): void {
        this._articleService.setup();
    }

    public setupOnLoad(): void {
        this._articleService.update();
    }

    public validDomElementExists(): boolean {
        // Article always exists
        return true;
    }

    public setupOnDomContentLoaded(): void {
        this.addLinks();
    }

    public registerListeners(): void {
        // Do nothing
    }
    
    private addLinks(): void {
        let articleElement: HTMLElement = document.querySelector('.jtcd-article') as HTMLElement;
        let headerElements: NodeList = articleElement.querySelectorAll('.header-1, .header-2');

        for (let i: number = 0; i < headerElements.length; i++) {
            let headerElement = headerElements[i] as HTMLElement;
            let buttonElement = headerElement.querySelector('div[role="button"]') as HTMLElement;
            let id = headerElement.getAttribute('id');

            let href = `${location.protocol}//${location.host}${location.pathname}#${id}`;

            // Clipboard for button
            buttonElement.setAttribute('data-clipboard-text', href);
            new Clipboard(buttonElement);

            // 'Popup' for button
            this._tooltipService.setupElement(buttonElement, 'right');
        }
    }
}