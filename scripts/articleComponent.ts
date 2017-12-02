﻿import AnchorJs = require('anchor-js');
import Component from './component';

class ArticleComponent extends Component {
    protected canInitialize(): boolean {
        return true;
    }

    protected setup(): void {
        //this.addAnchorsToHeadings();
    }

    protected registerListeners(): void {
    }

    private addAnchorsToHeadings(): void {
        let anchors = new AnchorJs();
        anchors.options = {
            placement: 'left',
            visible: 'touch'
        };
        anchors.add(`article h2:not(.no-anchor), 
            article h3:not(.no-anchor),
            article h4:not(.no-anchor),
            article h5:not(.no-anchor),
            article h6:not(.no-anchor)`);
    }
}

export default new ArticleComponent();