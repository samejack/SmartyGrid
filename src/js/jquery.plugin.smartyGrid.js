/*
 * jQuery SmartyGrid Plugin 1.0
 *
 * @author sj
 * @link https://github.com/samejack/SmartyGrid
 * @copyright Copyright 2013 SJ
 * @version 1.0.0
 * @license Apache License Version 2.0 (https://github.com/samejack/SmartyGrid/blob/master/LICENSE)
 */
jQuery.fn.smartyGrid = function(args, params) {

    // extenal Array indexOf function for IE hack
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(elem) {
            'use strict';
            var i = 0, len = this.length;
            for (; i < len; i += 1) {
                if (this[i] === elem) {
                    return i;
                }
            }
            return -1;
        };
    }

    return this.each(function () {
        var self = this;

        // hashchange auto reload girdlist
        if ($(this).data('SMARTY_GRID_HASH_FN') === undefined) {
            $(window).on('hashchange', function () {
                self.render();
            });
            $(this).data('SMARTY_GRID_HASH_FN', true);
        }

        // defined themes
        this.themes = {
            default: {
                checkBoxHtml: '<input type="checkbox" />',
                sortUpHtml: '<i>[P]</i>',
                sortDownHtml: '<i>[D]</i>',
                sortDefaultHtml: '<i>[S]</i>',
                tableHtml: '<table>',
                tableHeadHtml: '<thead>',
                tableHeadTrHtml: '<tr>',
                tableHeadThHtml: '<th>',
                tableBodyHtml: '<tbody>',
                tableBodyTrHtml: '<tr>',
                tableBodyTdHtml: '<td>',
                pagerHtml: '<div class="smarty-grid-pager"></div>',
                pagerPrevHtml: function (href) {
                    if (href !== false) {
                        return '<span><a href=\'' + href + '\'>&laquo;</a></span>';
                    } else {
                        return '<span>&laquo;</span>';
                    }
                },
                pagerNextHtml: function (href) {
                    if (href !== false) {
                        return '<span><a href=\'' + href + '\'>&raquo;</a></span>';
                    } else {
                        return '<span>&raquo;</span>';
                    }
                },
                pagerStartHtml: function (href) {
                    if (href !== false) {
                        return '<span><a href=\'' + href + '\'>&#124;&laquo;</a></span>';
                    } else {
                        return '<span>&#124;&laquo;</span>';
                    }
                },
                pagerEndHtml: function (href) {
                    if (href !== false) {
                        return '<span><a href=\'' + href + '\'>&raquo;&#124;</a></span>';
                    } else {
                        return '<span>&raquo;&#124;</span>';
                    }
                },
                pagerNoHtml: function (href, no) {
                    if (href !== false) {
                        return '<span><a href=\'' + href + '\'>' + no + '</a></span>';
                    } else {
                        return '<span>' + no + '</span>';
                    }
                }
            },
            bootstrap2: {
                checkBoxHtml: '<input type="checkbox" class="smarty-grid-checkbox-all" />',
                sortUpHtml: '<i class="icon-arrow-up"></i>',
                sortDownHtml: '<i class="icon-arrow-down"></i>',
                sortDefaultHtml: '<i class="icon-resize-vertical"></i>',
                tableHtml: '<table class="table table-striped">',
                tableHeadHtml: '<thead>',
                tableHeadTrHtml: '<tr>',
                tableHeadThHtml: '<th style="white-space: nowrap;">',
                tableBodyHtml: '<tbody>',
                tableBodyTrHtml: '<tr>',
                tableBodyTdHtml: '<td>',
                pagerHtml: '<div class="pagination pagination-centered"><ul class="smarty-grid-pager"></ul></div>',
                pagerPrevHtml: function (href) {
                    if (href !== false) {
                        return '<li><a href=\'' + href + '\'>&laquo;</a></li>';
                    } else {
                        return '<li class="disabled"><a href="javascript:void(0);">&laquo;</a></li>';
                    }
                },
                pagerNextHtml: function (href) {
                    if (href !== false) {
                        return '<li><a href=\'' + href + '\'>&raquo;</a></li>';
                    } else {
                        return '<li class="disabled"><a href="javascript:void(0);">&raquo;</a></li>';
                    }
                },
                pagerStartHtml: function (href) {
                    if (href !== false) {
                        return '<li><a href=\'' + href + '\'>&#124;&laquo;</a></li>';
                    } else {
                        return '<li class="disabled"><a href="javascript:void(0);">&#124;&laquo;</a></li>';
                    }
                },
                pagerEndHtml: function (href) {
                    if (href !== false) {
                        return '<li><a href=\'' + href + '\'>&raquo;&#124;</a></li>';
                    } else {
                        return '<li class="disabled"><a href="javascript:void(0);">&raquo;&#124;</a></li>';
                    }
                },
                pagerNoHtml: function (href, no) {
                    if (href !== false) {
                        return '<li><a href=\'' + href + '\'>' + no + '</a></li>';
                    } else {
                        return '<li class="active"><a href="javascript:void(0);">' + no + '</a></li>';
                    }
                }
            },
            bootstrap3: {
                checkBoxHtml: '<input type="checkbox" class="smarty-grid-checkbox-all" />',
                sortUpHtml: '<i class="glyphicon glyphicon-chevron-up"></i>',
                sortDownHtml: '<i class="glyphicon glyphicon-chevron-down"></i>',
                sortDefaultHtml: '<i class="glyphicon glyphicon-sort"></i>',
                tableHtml: '<table class="table table-striped">',
                tableHeadHtml: '<thead>',
                tableHeadTrHtml: '<tr>',
                tableHeadThHtml: '<th style="white-space: nowrap;">',
                tableBodyHtml: '<tbody>',
                tableBodyTrHtml: '<tr>',
                tableBodyTdHtml: '<td>',
                pagerHtml: '<div class="btn-group smarty-grid-pager"></div>',
                pagerPrevHtml: function (href) {
                    if (href !== false) {
                        return '<a class="btn btn-default" href=\'' + href + '\'>&laquo;</a>';
                    } else {
                        return '<a class="btn btn-default disabled" href="javascript:void(0);">&laquo;</a>';
                    }
                },
                pagerNextHtml: function (href) {
                    if (href !== false) {
                        return '<a class="btn btn-default" href=\'' + href + '\'>&raquo;</a>';
                    } else {
                        return '<a class="btn btn-default disabled" href="javascript:void(0);">&raquo;</a>';
                    }
                },
                pagerStartHtml: function (href) {
                    if (href !== false) {
                        return '<a class="btn btn-default" href=\'' + href + '\'>&#124;&laquo;</a></div>';
                    } else {
                        return '<a class="btn btn-default disabled" href="javascript:void(0);">&#124;&laquo;</a>';
                    }
                },
                pagerEndHtml: function (href) {
                    if (href !== false) {
                        return '<a class="btn btn-default" href=\'' + href + '\'>&raquo;&#124;</a>';
                    } else {
                        return '<a class="btn btn-default disabled" href="javascript:void(0);">&raquo;&#124;</a>';
                    }
                },
                pagerNoHtml: function (href, no) {
                    if (href !== false) {
                        return '<a class="btn btn-default" href=\'' + href + '\'>' + no + '</a>';
                    } else {
                        return '<a class="btn btn-default active" href="javascript:void(0);">' + no + '</a>';
                    }
                }
            }
        };

        this.main = function (args, params) {
            // 預設動作
            if (typeof(args) === 'object') {
                // update config
                var config = $(this).data('SMARTY_GRID_CONFIG'), i = null, hashObj = {}, tmpConfig;
                if (typeof(config) === 'undefined' || config === null) {
                    config = {
                        columns: [],
                        pagecode: 1,
                        pagesize: 20,
                        delta: 10,
                        pager: true,
                        pagerQuery: '.smarty-grid-pager',
                        theme: 'default',
                        sortField: undefined,
                        ajaxErrorCallback: function (json) {
                            self.log('SmartyGrid WebService error: ' + json.message + ' (' + json.code + ')');
                        },
                        afterRender: function (total, pagecode, pagesize) {},
                        order: 'ASC',
                        searchFields: [],
                        searchKeyword: undefined,
                        ajaxParams: {}
                    };
                }

                // make config
                jQuery.extend(config, args);

                // override theme configuration
                if (typeof(config.theme) === 'object') {
                    jQuery.extend(config, config.theme);
                } else if (typeof(config.theme) === 'string' && typeof(self.themes[config.theme]) !== 'undefined') {
                    jQuery.extend(config, self.themes[config.theme]);
                } else {
                    jQuery.extend(config, self.themes.default);
                }

                // restore hash
                hashObj = this.getHash();
                if (hashObj !== null) {
                    jQuery.extend(config, hashObj);
                }

                // fix data type
                config.pagecode = parseInt(config.pagecode, 10);
                config.pagesize = parseInt(config.pagesize, 10);
                config.delta = parseInt(config.delta, 10);

                // fir default sortField to number
                if (typeof(config.sortField) === 'string') {
                    for (i in config.columns) {
                        if (config.columns.hasOwnProperty(i) && config.columns[i].index === config.sortField) {
                            config.sortField = parseInt(i, 10);
                            break;
                        }
                    }
                }

                // save config
                $(this).data('SMARTY_GRID_CONFIG', config);
                $(this).data('SMARTY_GRID_DEFAULT_CONFIG', jQuery.extend(true, {}, config));

                // display header
                this.renderHeader();
            } else if (typeof(args) === 'string' && args === 'render') {
                var config = $(this).data('SMARTY_GRID_CONFIG'), hashObj = this.getHash();
                // run render command
                if (hashObj === null) {
                    if (typeof(params) !== 'undefined' && !isNaN(params)) {
                        config.pagecode = parseInt(params, 10);
                    }
                    this.setHash(config);
                } else {
                    if (typeof(params) !== 'undefined' && !isNaN(params)) {
                        hashObj.pagecode = parseInt(params, 10);
                    }
                    this.render();
                }
            } else if (typeof(args) === 'string' && args === 'search') {
                var config = $(this).data('SMARTY_GRID_CONFIG');
                // run search command
                if (typeof(params) === 'string') {
                    config.searchKeyword = params;
                    config.pagecode = 1;
                    this.setHash(config);
                } else if (typeof(config.searchInput) === 'object') {
                    config.searchKeyword = $(config.searchInput).val();
                    config.pagecode = 1;
                    this.setHash(config);
                } else {
                    this.log('Search keyword not found.');
                }
            } else if (typeof(args) === 'string' && args === 'pagesize') {
                var config = $(this).data('SMARTY_GRID_CONFIG');
                // run search command
                if (typeof(params) !== 'number') {
                    this.log('Page size format error.');
                } else {
                    config.pagesize = params;
                }
                this.setHash(config);
            } else if (typeof(args) === 'string' && args === 'reset') {
                // reset config and grid data
                $(this).data('SMARTY_GRID_CONFIG', $(this).data('SMARTY_GRID_DEFAULT_CONFIG'));
                this.setHash({});
            } else if (typeof(args) === 'string' && args === 'setparams') {
                // set extension ajax params
                var config = $(this).data('SMARTY_GRID_CONFIG');
                if (typeof(params) !== 'object') {
                    this.log('Params not a object.');
                } else {
                    config.ajaxParams = params;
                }
            }
        }

        /**
         * Log message
         *
         * @param {String} message
         */
        this.log = function (message) {
            if (typeof(console.log) === 'function') {
                console.log(message);
            }
        };

        /**
         * Get URL hash string
         * @returns {String}
         */
        this.getHash = function () {
            if (window.location.hash.substr(1) !== '') {
                return jQuery.parseJSON(decodeURIComponent(window.location.hash.substr(1)));
            }
            return null;
        };

        /**
         * Stringify and set to URL hash
         *
         * @param obj
         */
        this.setHash = function (obj) {
            var hashObject = {}, config = $(this).data('SMARTY_GRID_CONFIG'), json;

            hashObject.pagecode = obj.pagecode;
            hashObject.pagesize = obj.pagesize;

            if (typeof(config.searchKeyword) === 'string' && config.searchFields.length > 0) {
                hashObject.searchKeyword = obj.searchKeyword;
            } else {
                delete obj.searchKeyword;
            }
            if (obj.sortField !== undefined && config.columns[obj.sortField] !== undefined) {
                hashObject.sortField = obj.sortField;
                hashObject.order = obj.order;
            }
            json = JSON.stringify(hashObject);

            if (json === JSON.stringify(this.getHash())) {
                this.log('Hash is equal, force reload.');
                this.render();
            } else {
                window.location.hash = '#' + JSON.stringify(hashObject);
            }
        };

        /**
         * Render table headers
         */
        this.renderHeader = function () {
            var i = null, config = $(this).data('SMARTY_GRID_CONFIG'), columns = config.columns, html, th;

            // remove grid children and make header
            $(this).children().remove();
            $(this).append(
                config.tableHtml +
                config.tableHeadHtml +
                config.tableHeadTrHtml +
                '</tr></thead>' +
                config.tableBodyHtml +
                '</tbody></table>'
            );
            if (config.pager) {
                $(this).append(config.pagerHtml);
            }

            for (i in columns) {
                if (columns.hasOwnProperty(i)) {
                    if (columns[i].title === 'HIDDEN') {
                        continue;
                    } else if (columns[i].title === 'CHECKBOX') {
                        // render checkbox selector
                        html = config.tableHeadThHtml + config.checkBoxHtml + '</th>';
                        $(this).find('thead tr:first').append(html);
                        $(this).find('thead tr th:last').addClass('smarty-grid-th-' + i);
                        $('.smarty-grid-checkbox-all').click(function(){
                            if (typeof($(this).prop('checked')) === 'undefined' || $(this).prop('checked') === false || $(this).prop('checked') === null) {
                                $('.smarty-grid-checkbox').prop('checked', false);
                            } else {
                                $('.smarty-grid-checkbox').prop('checked', true);
                            }
                        });
                        continue;
                    } else {
                        html = config.tableHeadThHtml + columns[i].title;
                        if (columns[i].sortable) {
                            html += '<span class="sort-icon">';
                            if (typeof(config.sortField) !== 'undefined' && config.sortField === columns[i].index) {
                                if (config.order === 'ASC') {
                                    html += config.sortUpHtml;
                                } else {
                                    html += config.sortDownHtml;
                                }
                            } else {
                                html += config.sortDefaultHtml;
                            }
                            html += '</span>';
                        }
                        html += '</th>';
                        $(this).find('thead tr:first').append(html);
                        th = $(this).find('thead tr th:last');
                        th.addClass('smarty-grid-th-' + i);
                        th.data('index', columns[i].index);

                        // bind sort event
                        if (columns[i].sortable) {
                            // save index value
                            $('smarty-grid-th-' + i + ' .sort-icon').data('index', columns[i].index);
                            th.click(function () {
                                var config = $(this).parents('table').parent().data('SMARTY_GRID_CONFIG'),
                                    toSortField = $(this).data('index'),
                                    hashObj;

                                // reset all sort icon
                                $(this).parent().find('.sort-icon').html(config.sortDefaultHtml);

                                config.sortField = toSortField;
                                if (typeof(config.sortField) !== 'undefined') {
                                    if (config.order === 'ASC') {
                                        config.order = 'DESC';
                                        $(this).find('.sort-icon').html(config.sortDownHtml);
                                    } else {
                                        config.order = 'ASC';
                                        $(this).find('.sort-icon').html(config.sortUpHtml);
                                    }
                                }

                                hashObj = self.getHash();
                                hashObj.order = config.order;
                                hashObj.sortField = config.sortField;

                                self.setHash(hashObj);
                            });
                        }
                    }
                }
            }
        };

        // render pager component
        this.renderPager = function (config) {
            var parent = this, i, start, end, html = '', first = 1, last = Math.ceil(config.total / config.pagesize), hashObj;

            $(this).find(config.pagerQuery).children().remove();

            if (config.pager && typeof(config.total) !== 'undefined') {

                hashObj = this.getHash();

                //fixed pagecode
                if (config.pagecode > last) {
                    config.pagecode = last;
                }
                if (config.pagecode < first) {
                    config.pagecode = first;
                }

                //display first button
                if (config.pagecode === first || config.total === 0) {
                    html += config.pagerStartHtml(false);
                    html += config.pagerPrevHtml(false);
                } else {
                    hashObj.pagecode = first;
                    html += config.pagerStartHtml('#' + JSON.stringify(hashObj));
                    hashObj.pagecode = config.pagecode - 1;
                    html += config.pagerPrevHtml('#' + JSON.stringify(hashObj));
                }

                //display middle button
                start = first;
                end = last;
                if (Math.ceil(config.total / config.pagesize) > config.delta) {
                    if (config.pagecode - Math.ceil(config.delta / 2) < first) {
                        end = config.delta;
                    } else if ((config.pagecode + Math.ceil(config.delta / 2) - 1) > last ) {
                        start = last - config.delta + 1;
                    } else {
                        start = config.pagecode - Math.ceil(config.delta / 2);
                        end = config.pagecode + Math.ceil(config.delta / 2) - 1;
                    }
                }
                for (i = start; i <= end; i++) {
                    if (i === config.pagecode) {
                        html += config.pagerNoHtml(false, i);
                    } else {
                        hashObj.pagecode = i;
                        html += config.pagerNoHtml('#' + JSON.stringify(hashObj), i);
                    }
                }

                //display last button
                if (config.pagecode === last || config.total === 0) {
                    html += config.pagerNextHtml(false);
                    html += config.pagerEndHtml(false);
                } else {
                    hashObj.pagecode = config.pagecode + 1;
                    html += config.pagerNextHtml('#' + JSON.stringify(hashObj));
                    hashObj.pagecode = last;
                    html += config.pagerEndHtml('#' + JSON.stringify(hashObj));
                }

                $(this).find('.smarty-grid-pager').append(html);

            } else {
                $(this).find('.smarty-grid-pager').hide();
            }
        };

        this.renderCheckbox = function (value, model, config, index) {
            var name = 'id', html = '';
            if (config.index !== undefined) {
                name = config.index;
            }
            if (config['class'] !== undefined) {
                html += '<td class="' + config['class']+'">';
            } else {
                html += '<td>';
            }
            html += '<input type="checkbox" name="' + name + '[]" value="' + value + '" class="smarty-grid-checkbox smarty-grid-row-' + index + '" /></td>';
            return html;
        };

        this.renderRows = function (config, model) {
            var columns = config.columns, html = '', value, i, j, k, string = '', arr = [];
            $(this).find('tbody').children().remove();
            for (i in model) {
                if (model.hasOwnProperty(i)) {
                    html = config.tableBodyTrHtml;
                    for (j in columns) {
                        if (columns.hasOwnProperty(j)) {
                            // make column value
                            if (typeof(columns[j].index) === 'object') {
                                // complex index
                                value = [];
                                for (k in columns[j].index) {
                                    if (columns[j].index.hasOwnProperty(k)) {
                                        value[columns[j].index[k]] = model[i][columns[j].index[k]];
                                    }
                                }
                            } else {
                                // non-complex index
                                value = model[i][columns[j].index];
                            }

                            if (columns[j].title === 'CHECKBOX') {
                                // render check box
                                if (columns[j].render !== undefined && typeof(columns[j].render) === 'function') {
                                    html += columns[j].render(value, model[i], columns[j], i);
                                    continue;
                                } else {
                                    // fix value to string
                                    if (typeof(value) === 'object') {
                                        value = value.join(', ');
                                    }
                                    html += this.renderCheckbox(value, model[i], columns[j], i);
                                }
                            } else if (columns[j].index !== undefined) {
                                if (columns[j].render !== undefined && typeof(columns[j].render) === 'function') {
                                    html += columns[j].render(value, model[i], columns[j], i);
                                    continue;
                                } else {
                                    // fix value to string
                                    if (typeof(value) === 'object') {
                                        arr = [];
                                        for (k in value) {
                                            if (value.hasOwnProperty(k)) {
                                                arr.push(value[k]);
                                            }
                                        }
                                        string = arr.join(', ');
                                    } else {
                                        string = value;
                                    }
                                    html += config.tableBodyTdHtml + string + '</td>'
                                }
                            } else {
                                html += config.tableBodyTdHtml + '</td>';
                            }
                        }
                    }
                    html += '</tr>';
                    $(this).find('tbody').append(html);
                }
            }
            $('.smarty-grid-checkbox').click(function () {
                if ($(self).find('.smarty-grid-checkbox:checkbox:checked').size() === $(self).find('.smarty-grid-checkbox:checkbox').size()) {
                    $('.smarty-grid-checkbox-all').prop('checked', true);
                } else {
                    $('.smarty-grid-checkbox-all').prop('checked', false);
                }
            });
        };

        this.render = function () {
            //load configuration
            var config = $(this).data('SMARTY_GRID_CONFIG'),
                uri = config.uri,
                parent = this,
                offset = null,
                index = null,
                i = null,
                j = null,
                data,
                queryObject,
                pagecode;

            // asign keyword
            if (typeof(config.searchInput) === 'object' && typeof(config.searchKeyword) === 'string' && config.searchKeyword.length > 0) {
                $(config.searchInput).val(config.searchKeyword);
            }

            // check page code
            pagecode = parseInt(this.getHash().pagecode, 10);
            if (config.total !== undefined && config.total !== 0 &&
                    (typeof(pagecode) === 'undefined' || pagecode <= 0 || pagecode > (Math.ceil(config.total / config.pagesize)))) {
                this.log('pagecode error: ' + pagecode);
                return;
            }
            config.pagecode = pagecode;

            // make query object
            offset = (config.pagecode - 1) * config.pagesize;
            queryObject = {
                offset: offset,
                size: config.pagesize,
                pagecode: config.pagecode
            };

            // make sort column
            if (typeof(config.sortField) === 'object') {
                // multiple columns sort
                queryObject.sorts = {};
                for (index in config.sortField) {
                    queryObject.sorts[config.sortField[index]] = config.order;
                }
            } else if (typeof(config.sortField) === 'string') {
                // one column sort
                queryObject.sorts = {};
                queryObject.sorts[config.sortField] = config.order;
            }

            // search
            if (typeof(config.searchKeyword) === 'string' && config.searchKeyword.length > 0 && config.searchFields.length > 0) {
                queryObject.search = {};
                for (index in config.searchFields) {
                    if (config.searchFields.hasOwnProperty(index)) {
                        queryObject.search[config.searchFields[index]] = config.searchKeyword;
                    }
                }
            }
            // make columns
            queryObject.columns = [];
            for (i in config.columns) {
                if (config.columns.hasOwnProperty(i)) {
                    if (typeof(config.columns[i].index) === 'object') {
                        // complex index
                        for (j in config.columns[i].index) {
                            if (config.columns[i].index.hasOwnProperty(j) && queryObject.columns.indexOf(config.columns[i].index[j]) === -1) {
                                queryObject.columns.push(config.columns[i].index[j]);
                            }
                        }
                    } else {
                        // non-complex index
                        if (queryObject.columns.indexOf(config.columns[i].index) === -1) {
                            queryObject.columns.push(config.columns[i].index);
                        }
                    }
                }
            }

            // append extension params
            if (typeof(config.ajaxParams) === 'object') {
                for (i in config.ajaxParams) {
                    if (config.ajaxParams.hasOwnProperty(i)) {
                        queryObject[i] = config.ajaxParams[i];
                    }
                }
            }

            if (typeof(config.data) === 'object') {
                // static data
                data = [];
                for (i = offset; i < offset + config.pagesize; i++) {
                    if (i < config.data.length) {
                        data.push(config.data[i]);
                    }
                }

                // update total
                config.total = parseInt(config.data.length, 10);
                // render pager
                this.renderRows(config, data);
                this.renderPager(config);
                if (typeof(config.afterRender) === 'function') {
                    config.afterRender(config.total, config.pagecode, config.pagesize);
                }
            } else {
                //call ajax to get data
                //ajax call
                $.getJSON(uri, queryObject, function (json) {
                    if (typeof(json) !== 'object') {
                        self.log('SmartyGrid WebService error: Return data not a JSON object.');
                    } else if (typeof(json.code) === 'undefined') {
                        self.log('SmartyGrid WebService format error. (code not found)');
                    } else if (json.code !== 0) {
                        if (typeof(config.ajaxErrorCallback) === 'function') {
                            config.ajaxErrorCallback(json);
                        }
                    } else if (typeof(json.message) === 'undefined') {
                        self.log('SmartyGrid WebService format error. (message not found)');
                    } else if (typeof(json.data) === 'undefined') {
                        self.log('SmartyGrid WebService format error. (data not found)');
                    } else if (typeof(json.data.total) === 'undefined' || typeof(json.data.list) === 'undefined') {
                        self.log('SmartyGrid WebService data format error.');
                    } else {
                        // update total
                        config.total = parseInt(json.data.total, 10);
                        // render pager
                        parent.renderRows(config, json.data.list);
                        parent.renderPager(config);
                        if (typeof(config.afterRender) === 'function') {
                            config.afterRender(config.total, config.pagecode, config.pagesize);
                        }
                    }
                });
            }
        };

        // invoke main function
        this.main(args, params);
    });
};
