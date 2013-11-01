/*
 * jQuery SmartyGrid Plugin 1.0
 *
 * @author sj
 * @link https://github.com/smajeack/SmartyGrid
 * @copyright Copyright 2013 SJ
 * @version 1.0
 * @license Apache License Version 2.0 (https://github.com/samejack/SmartyGrid/blob/master/LICENSE)
 */
jQuery.fn.smartyGrid = function(args, params) {
    return this.each(function () {

        var self = this;

        this.log = function (message) {
            if (typeof(console.log) === 'function') {
                console.log(message);
            }
        };

        this.renderHeader = function() {
            var i = null, config = $(this).data('SMARTY_GRID_CONFIG'), columns = config.columns, html;

            // remove grid children and make header
            $(this).children().remove();
            $(this).append(
                config.tableHtml +
                config.tableHeadHtml +
                config.tableHeadTrHtml +
                '</tr></thead>' +
                config.tableBodyHtml +
                '</tbody></table><div class="pagination pagination-centered"><ul class="smarty-grid-pager"></ul></div>'
            );

            for (i in columns) {
                html = '';
                if (columns[i].title === 'HIDDEN') {
                    continue;
                } else if (columns[i].title === 'CHECKBOX') {
                    // render chexkbox selector
                    html += config.tableHeadThHtml + '<input type="checkbox" class="smarty-grid-checkbox-all" /></th>';
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
                    html += config.tableHeadThHtml + columns[i].title;
                    if (columns[i].sortable) {
                        html += '<span class="sort-icon">';
                        if (typeof(config.sortField) !== 'undefined' && config.sortField === parseInt(i, 10)) {
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
                    $(this).find('thead tr th:last').addClass('smarty-grid-th-' + i);

                    // bind sort event
                    if (columns[i].sortable) {
                        $(this).find('thead tr th:last').click(function(){
                            var config = $(this).parents('table').parent().data('SMARTY_GRID_CONFIG'),
                                toSortField = $(this).parent().children().index(this);

                            // reset all sort icon
                            $(this).parent().find('.sort-icon').html(config.sortDefaultHtml);

                            config.sortField = toSortField;
                            if (typeof(config.sortField) !== 'undefined' && config.sortField === toSortField) {
                                if (config.order === 'ASC') {
                                    config.order = 'DESC';
                                    $(this).find('.sort-icon').html(config.sortDownHtml);
                                } else {
                                    config.order = 'ASC';
                                    $(this).find('.sort-icon').html(config.sortUpHtml);
                                }
                            }

                            // render
                            $(this).parents('table').parent().smartyGrid('render');
                        });
                    }
                }
            }
        };

        // render pager component
        this.renderPager = function (config) {
            var parent = this, i, start, end, html = '', first = 1, last = Math.ceil(config.total / config.pagesize);

            $(this).find('.smarty-grid-pager').children().remove();

            if (config.pager && typeof(config.total) !== 'undefined') {

                //fixed pagecode
                if (config.pagecode > last) {
                    config.pagecode = last;
                }
                if (config.pagecode < first) {
                    config.pagecode = first;
                }

                //display first button
                if (config.pagecode === first) {
                    html += '<li><a href="javascript:void(0);">&#124;&laquo;</a></li>';
                    html += '<li><a href="javascript:void(0);">&laquo;</a></li>';
                }else{
                    html += '<li><a href="javascript:void(0);" rel="' + first + '">&#124;&laquo;</a></li>';
                    html += '<li><a href="javascript:void(0);" rel="' + (config.pagecode-1) + '">&laquo;</a></li>';
                }

                //display middel button
                start = first;
                end = last;
                if (Math.ceil(config.total / config.pagesize)>config.delta) {
                    if (config.pagecode - Math.ceil(config.delta / 2)<first) {
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
                        html += '<li class="active"><a href="javascript:void(0);" rel="' + i + '">' + i + '</a></li>';
                    } else {
                        html += '<li><a href="javascript:void(0);" rel="' + i + '">' + i + '</a></li>';
                    }
                }

                //display last button
                if( config.pagecode === last ){
                    html += '<li><a href="javascript:void(0);">&raquo;</a></li>';
                    html += '<li><a href="javascript:void(0);">&raquo;&#124;</a></li>';
                }else{
                    html += '<li><a href="javascript:void(0);" rel="' + (config.pagecode + 1) + '">&raquo;</a></li>';
                    html += '<li><a href="javascript:void(0);" rel="' + last + '">&raquo;&#124;</a></li>';
                }

                $(this).find('.smarty-grid-pager').append(html);
                $(this).find('.smarty-grid-pager a').click(function () {
                    var pagecode = parseInt($(this).attr('rel'), 10);
                    if (!$(this).parent().hasClass('active') && typeof($(this).attr('rel')) !== 'undefined' && pagecode !== 'NaN') {
                        parent.render(pagecode);
                    }
                    return false;
                });
            } else {
                $(this).find('.smarty-grid-pager').hide();
            }
        };

        this.renderCheckbox = function(value, model, config, index){
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

        this.renderRows = function(config, model){
            var columns = config.columns, html = '', value, i, j, k, string = '', arr = [];
            $(this).find('tbody').children().remove();

            for (i in model) {
                html = config.tableBodyTrHtml;
                for (j in columns) {
                    // make column value
                    if (typeof(columns[j].index) === 'object') {
                        // complex index
                        value = [];
                        for (k in columns[j].index) {
                            value[columns[j].index[k]] = model[i][columns[j].index[k]];
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
                                    arr.push(value[k]);
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
                html += '</tr>';
                $(this).find('tbody').append(html);
            }
            $('.smarty-grid-checkbox').click(function () {
                if ($(self).find('.smarty-grid-checkbox:checkbox:checked').size() === $(self).find('.smarty-grid-checkbox:checkbox').size()) {
                    $('.smarty-grid-checkbox-all').prop('checked', true);
                } else {
                    $('.smarty-grid-checkbox-all').prop('checked', false);
                }
            });
        };

        this.render = function(pagecode){
            //load configuration
            var config = $(this).data('SMARTY_GRID_CONFIG'), uri = config.uri, parent = this, offset = 0, index = null, i = null, j = null, data, queryObject;

            // check page code
            pagecode = parseInt(pagecode, 10);
            if (config.total !== undefined && config.total !== 0 &&
                    (typeof(pagecode) === 'undefined' || pagecode <= 0 || pagecode > (Math.ceil(config.total / config.pagesize)))) {
                console.warn('pagecode error: ' + pagecode);
                return;
            }
            config.pagecode = parseInt(pagecode, 10);

            // make query object
            offset = (config.pagecode - 1) * config.pagesize;
            queryObject = {
                offset: offset,
                size: config.pagesize,
                pagecode: config.pagecode
            }
            if (typeof(config.sortField) !== 'undefined' && typeof(config.columns[config.sortField]) !== 'unedfined') {
                queryObject.sorts = {};
                if (typeof(config.columns[config.sortField].index) === 'object') {
                	for (index in config.columns[config.sortField].index) {
                		queryObject.sorts[config.columns[config.sortField].index[index]] = config.order;
                	}
                } else {
                	queryObject.sorts[config.columns[config.sortField].index] = config.order;
                }
                
            }
            if (typeof(config.searchKeyword) === 'string' && config.searchKeyword.length > 0 && config.searchFields.length > 0) {
                queryObject.search = {};
                for (index in config.searchFields) {
                    queryObject.search[config.searchFields[index]] = config.searchKeyword;
                }
            }
            // make columns
            queryObject.columns = [];
            for (i in config.columns) {
                if (typeof(config.columns[i].index) === 'object') {
                    // complex index
                    for (j in config.columns[i].index) {
                        if (queryObject.columns.lastIndexOf(config.columns[i].index[j]) === -1) {
                            queryObject.columns.push(config.columns[i].index[j]);
                        }
                    }
                } else {
                    // non-complex index
                    if (queryObject.columns.lastIndexOf(config.columns[i].index) === -1) {
                        queryObject.columns.push(config.columns[i].index);
                    }
                }
            }

            // append extension params
            if (typeof(config.ajaxParams) === 'object') {
                for (i in config.ajaxParams) {
                    queryObject[i] = config.ajaxParams[i];
                }
            }

            if (config.uri === undefined) {
                // static data
                config.total = parseInt(config.data.length, 10);

                // page process
                data = [];
                for (i = offset; i < offset + config.pagesize; i++) {
                    if (i < config.data.length) {
                        data.push(config.data[i]);
                    }
                }

                this.renderRows(config, data);
                this.renderPager(config);

                if( typeof(config.afterRender)==='function' ){
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
                        //update total
                        config.total = parseInt(json.data.total, 10);
                        //render pager
                        parent.renderRows(config, json.data.list);
                        parent.renderPager(config);
                        if( typeof(config.afterRender) === 'function' ){
                            config.afterRender(config.total, config.pagecode, config.pagesize);
                        }
                    }
                });
            }

            // set hash
            delete queryObject.offset;
            delete queryObject.size;
            delete queryObject.sorts;
            delete queryObject.search;
            delete queryObject.columns;
            if (typeof(config.searchKeyword) === 'string' && config.searchFields.length > 0) {
                queryObject.searchKeyword = config.searchKeyword;
            }
            if (config.sortField !== undefined && config.columns[config.sortField] !== undefined) {
                queryObject.sortField = config.sortField;
                queryObject.order = config.order;
            }
            window.location.hash = '#' + JSON.stringify(queryObject);
        };

        // 預設動作
        if (typeof(args) === 'object') {
            // update config
            var config = $(this).data('SMARTY_GRID_CONFIG'), i = null, hashObj;
            if (config === undefined || config === null) {
                config = {
                    columns: [],
                    pagecode: 1,
                    pagesize: 20,
                    pager: true,
                    delta: 10,
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

            // restore hash
            if (window.location.hash !== '') {
                hashObj = jQuery.parseJSON(window.location.hash.substr(1));
                jQuery.extend(config, hashObj);
            }

            // fix data type
            config.pagecode = parseInt(config.pagecode, 10);
            config.pagesize = parseInt(config.pagesize, 10);
            config.delta = parseInt(config.delta, 10);

            // fir default sortField to number
            if (typeof(config.sortField) === 'string') {
                for (i in config.columns) {
                    if (config.columns[i].index === config.sortField) {
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
            // run render command
            if (typeof(params) !== 'undefined') {
                this.render(parseInt(params, 10));
            } else {
                this.render($(this).data('SMARTY_GRID_CONFIG').pagecode);
            }
        } else if (typeof(args) === 'string' && args === 'search') {
            // run search command
            if (typeof(params) !== 'string') {
                console.warn('Search keyword not found.');
            } else {
                $(this).data('SMARTY_GRID_CONFIG').searchKeyword = params;
                this.render(1);
            }
        } else if (typeof(args) === 'string' && args === 'reset') {
            // reset config and grid data
            $(this).data('SMARTY_GRID_CONFIG', $(this).data('SMARTY_GRID_DEFAULT_CONFIG'));
            window.location.hash = '';
        } else if (typeof(args) === 'string' && args === 'setparams') {
            // set extension ajax params
            var config = $(this).data('SMARTY_GRID_CONFIG');
            if (typeof(params) !== 'object') {
                console.warn('Params not a object.');
            } else {
                config.ajaxParams = params;
            }
        }

    });
};
