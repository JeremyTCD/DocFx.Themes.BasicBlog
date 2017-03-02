﻿import { htmlEncode, htmlDecode, generateMultiLevelList, ListItem, generateListItemTree } from './utils';

class RightMenuBuilder {
    public build(): void {
        let listItemTree: ListItem = generateListItemTree($('article > h1,h2,h3').get(), ['h2', 'h3'], 0);
        let html = generateMultiLevelList(listItemTree.items, '', 0);

        $("#outline").append('<h5 class="title">In This Article</h5>' + html);
    }

    private setupScrolling(): void {
        //$('#outline').on('activate.bs.scrollspy', function(e) {
        //        if (e.target) {
        //            if ($(e.target).find('li.active').length > 0) {
        //                return;
        //            }
        //            let top = $(e.target).position().top;
        //            $(e.target).parents('li').each(function (i, e) {
        //                top += $(e).position().top;
        //            });
        //            let container = $('#outline > ul');
        //            let height = container.height();
        //            container.scrollTop(container.scrollTop() + top - height / 2);
        //        }
        //    })
    }
}

export default new RightMenuBuilder();