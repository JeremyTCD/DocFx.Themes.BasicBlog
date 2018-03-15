import { injectable, inject } from 'inversify';
import RootComponent from '../shared/rootComponent';
import NavbarComponent from './navbarComponent';
import SearchComponent from './searchComponent';
import SearchResultsComponent from './searchResultsComponent';
import TransitionService from '../shared/transitionService';
import OverlayService from '../shared/overlayService';
import MediaService from '../shared/mediaService';
import Component from '../shared/component';
import { MediaWidth } from '../shared/mediaWidth';

@injectable()
export default class PageHeaderComponent extends RootComponent {
    private _transitionService: TransitionService;
    private _overlayService: OverlayService;
    private _mediaService: MediaService;

    private _searchComponent: SearchComponent;

    private _pageHeaderElement: HTMLElement;
    private _buttonElement: HTMLElement;
    private _navbarAndSearchWrapper: HTMLElement;

    private _childComponents: Component[];

    public constructor(
        transitionService: TransitionService,
        overlayService: OverlayService,
        mediaService: MediaService,
        searchComponent: SearchComponent,
        navbarComponent: NavbarComponent,
        searchResultsComponent: SearchResultsComponent) {
        super();

        this._transitionService = transitionService;
        this._overlayService = overlayService;
        this._mediaService = mediaService;
        this._searchComponent = searchComponent;

        this.addChildComponents(searchComponent, navbarComponent, searchResultsComponent);
    }

    public enabled(): boolean {
        // Header always exists
        return true;
    }

    public setupImmediate(): void {
        this.childComponentsSetupImmediate();
    }

    public setupOnDomContentLoaded(): void {
        this.childComponentsSetupOnDomContentLoaded();

        this._buttonElement = document.getElementById('page-header-button');
        this._navbarAndSearchWrapper = document.getElementById('page-header-navbar-and-search-wrapper');
        this._pageHeaderElement = document.getElementById('page-header');

    }

    public setupOnLoad(): void {
        this.childComponentsSetupOnLoad();
    }

    public registerListeners(): void {
        this.childComponentsRegisterListeners();

        this._buttonElement.addEventListener('click', this.buttonClickListener);
        window.addEventListener('resize', this.windowResizeListener);
    }

    private windowResizeListener = () => {
        // Going from wide/medium to narrow
        if (this._mediaService.mediaWidthNarrow() && this._mediaService.mediaWidthChanged()) {

            // Search component has query
            if (this._searchComponent.hasQuery()) {
                this._transitionService.expandHeightWithoutTransition(this._navbarAndSearchWrapper, this._buttonElement);
            } else {
                // In wide/medium, height of navbar and search wrapper is auto
                this._transitionService.contractHeightWithoutTransition(this._navbarAndSearchWrapper, this._buttonElement);
            }

        } else if (!this._mediaService.mediaWidthNarrow() && this._mediaService.getPreviousMediaWidth() === MediaWidth.narrow) {
            // Going from narrow to wide/medium
            this._transitionService.reset(this._navbarAndSearchWrapper, this._buttonElement);

            // Search component has no query
            if (!this._searchComponent.hasQuery()) {
                this._overlayService.deactivateOverlay(this._pageHeaderElement, false);
            }
        }
    }

    private buttonClickListener = () => {
        if (this._buttonElement.classList.contains('expanded')) {
            this._searchComponent.reset();
            this._overlayService.deactivateOverlay(this._pageHeaderElement);
            this._pageHeaderElement.classList.remove('above-overlay');
        } else {
            this._pageHeaderElement.classList.add('above-overlay');
            this._overlayService.activateOverlay(this._pageHeaderElement, false);
        }

        this._transitionService.toggleHeightWithTransition(this._navbarAndSearchWrapper, this._buttonElement);
    }
} 