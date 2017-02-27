﻿import { getAbsolutePath, isRelativePath, toggleHeightForTransition } from './utils';
import breadcrumbsBuilder from './breadcrumbs';

class SideMenuBuilder {
    build(): void {
        let tocPath = $("meta[property='docfx\\:tocrel']").attr("content");

        if (tocPath) {
            tocPath = tocPath.replace(/\\/g, '/');
        }
        5
        $.get(tocPath, (data) => {
            let toc = $.parseHTML(data);
            $('#side-menu-toc').append(toc);

            this.setupSideMenuScroll();
            this.setupToc();

            let index = tocPath.lastIndexOf('/');
            let tocrel = '';
            if (index > -1) {
                tocrel = tocPath.substr(0, index + 1);
            }
            let currentHref = getAbsolutePath(window.location.pathname);

            $('#side-menu-toc').
                find('a[href]').
                each((index: number, anchorElement: HTMLAnchorElement) => {
                    let href = $(anchorElement).attr("href");
                    if (isRelativePath(href)) {
                        href = tocrel + href;
                        $(anchorElement).attr("href", href);
                    }

                    this.setupTopicPadding($(anchorElement).parent());

                    if (getAbsolutePath(anchorElement.href) === currentHref) {
                        $(anchorElement).parent().addClass('active');
                        $(anchorElement).
                            parentsUntil('#side-menu-toc').
                            filter('li.expandable').
                            each((index: number, listElement: HTMLLIElement) => {
                                toggleHeightForTransition($(listElement).children('ul'), $(listElement));
                            });

                        //parentLis.addClass('expanded');
                        //breadcrumbsBuilder.
                        //    loadChildBreadcrumbs(parentLis.add(anchorElement).get() as HTMLAnchorElement[]);

                        // for active li, expand it
                        $(anchorElement).
                            parents('ul.nav>li').
                            addClass('expanded');

                        // Scroll to active item
                        //let top = 0;
                        //$(anchorElement).parents('li').each(function (i, e) {
                        //    top += $(e).position().top;
                        //});

                        // 50 is the height of the filter box
                        //$('#side-menu-toc').scrollTop(top - 50);
                        //if ($('footer').is(':visible')) {
                        //    $('#side-menu-toc').addClass('shiftup');
                        //}
                    } else {
                        $(anchorElement).parent().removeClass('active');
                        $(anchorElement).parents('li').children('a').removeClass('active');
                    }
                });
        });
    }

    setupTopicPadding(topicElement: JQuery): void {
        let level = topicElement.data('level');
        if (level == 1) {
            return
        }
        topicElement.css('padding-left', 9 + (level - 1) * 14 + 'px');
    }

    setupSideMenuScroll(): void {
        $(window).scroll((event: JQueryEventObject) => {
            let element = $('#side-menu .wrapper');
            let top = element[0].parentElement.getBoundingClientRect().top;
            if (top < 23) {
                element.addClass('fixed');
            } else {
                element.removeClass('fixed');
            }
        });
    }

    setupToc(): void {
        $('#side-menu-toc ul > li.expandable').click((event: JQueryEventObject) => {
            let closestLi = $(event.target).closest('li');
            let childUl = closestLi.children('ul');

            toggleHeightForTransition(childUl, closestLi);

            // If event propogates, every parent li.expandable's click listener will
            // be called
            event.stopPropagation();
        });

        $('#toc_filter_input').on('input', function (event: JQueryEventObject) {
            let val = this.value;
            if (val === '') {
                // Clear 'filtered' class
                $('#side-menu-toc li').removeClass('filtered').removeClass('hide');
                return;
            }

            // Get leaf nodes
            $('#side-menu-toc li>a').filter(function (i, e) {
                return $(e).siblings().length === 0
            }).each(function (i, anchor) {
                let text = $(anchor).text();
                let parent = $(anchor).parent();
                let parentNodes = parent.parents('ul>li');
                for (let i = 0; i < parentNodes.length; i++) {
                    let parentText = $(parentNodes[i]).children('a').text();
                    if (parentText) text = parentText + '.' + text;
                };
                if (filterNavItem(text, val)) {
                    parent.addClass('show');
                    parent.removeClass('hide');
                } else {
                    parent.addClass('hide');
                    parent.removeClass('show');
                }
            });
            $('#side-menu-toc li>a').filter(function (i, e) {
                return $(e).siblings().length > 0
            }).each(function (i, anchor) {
                let parent = $(anchor).parent();
                if (parent.find('li.show').length > 0) {
                    parent.addClass('show');
                    parent.addClass('filtered');
                    parent.removeClass('hide');
                } else {
                    parent.addClass('hide');
                    parent.removeClass('show');
                    parent.removeClass('filtered');
                }
            })

            function filterNavItem(name, text) {
                if (!text) return true;
                if (name.toLowerCase().indexOf(text.toLowerCase()) > -1) return true;
                return false;
            }
        });
    }
}

export default new SideMenuBuilder();