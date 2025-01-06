/*
 * jQuery SmartyGrid Plugin
 *
 * @author sj
 * @link https://github.com/samejack/SmartyGrid
 * @copyright Copyright 2013 SJ
 * @version 1.3.6
 * @license Apache License Version 2.0 (https://github.com/samejack/SmartyGrid/blob/master/LICENSE)
 */
jQuery.fn.smartyGrid = function (args, params) {

  // extenal Array indexOf function for IE hack
  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (elem) {
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

  // public method
  var methods = {
    config: function () {
      return $(this).data('SMARTY_GRID_CONFIG');
    }
  };
  if (methods[args]) {
    return methods[args].apply(this, Array.prototype.slice.call(arguments, 1));
  }

  return this.each(function () {
    var self = this;

    // auto reload girdlist on hash change event
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
        tableCheckBoxThHtml: '<th width="6">',
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
        tableCheckBoxThHtml: '<th width="6">',
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
        tableCheckBoxThHtml: '<th width="6">',
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
        var config = $(this).data('SMARTY_GRID_CONFIG');
        if (typeof(config) === 'undefined' || config === null) {
          config = {
            columns: [],
            pageCode: 1,
            pageSize: 20,
            delta: 10,
            pager: true,
            pagerQuery: '.smarty-grid-pager',
            theme: 'default',
            ajaxErrorCallback: function (json) {
              self.log('SmartyGrid WebService error: ' + json.message + ' (' + json.code + ')');
            },
            afterRender: function (total, pageCode, pageSize, reponse) {
            },
            beforeRender: function (config) {
              return config;
            },
            order: 'ASC',
            searchFields: [],
            sortFields: [],
            searchKeyword: undefined,
            ajaxParams: {},
            appendQueryObj: {},
          };
        }

        // make config
        jQuery.extend(config, args);

        // override theme configuration
        if (typeof(config.theme) === 'string' && typeof(self.themes[config.theme]) !== 'undefined') {
          jQuery.extend(config, self.themes[config.theme]);
        } else {
          jQuery.extend(config, self.themes.default);
        }

        // override theme template (template)
        if (typeof(config.template) === 'object') {
          jQuery.extend(config, config.template);
        }

        // restore hash
        hashObj = this.getHash();
        if (hashObj !== null) {
          jQuery.extend(config, hashObj);
        }

        // fix data type
        config.pageCode = parseInt(config.pageCode, 10);
        config.pageSize = parseInt(config.pageSize, 10);
        config.delta = parseInt(config.delta, 10);

        // save config
        $(this).data('SMARTY_GRID_CONFIG', config);
        $(this).data('SMARTY_GRID_DEFAULT_CONFIG', jQuery.extend(true, {}, config));

        // display header
        this.renderHeader();
      } else if (typeof(args) === 'string' && args === 'render') {
        var config = $(this).data('SMARTY_GRID_CONFIG'), hashObj = this.getHash();

        // invoke before render
        if (typeof(config.beforeRender) === 'function') {
          config = config.beforeRender(config);
        }

        // run render command
        if (typeof(params) !== 'undefined' && !isNaN(params)) {
          config.pageCode = parseInt(params, 10);
        }
        this.setHash(config);
      } else if (typeof(args) === 'string' && args === 'search') {
        var config = $(this).data('SMARTY_GRID_CONFIG');
        // run search command
        if (typeof(params) !== 'string') {
          this.log('Search keyword not found. Second param not defined.');
        } else {
          config.searchKeyword = params.trim();
          config.pageCode = 1;
          this.setHash(config);
        }
      } else if (typeof(args) === 'string' && args === 'pageSize') {
        var config = $(this).data('SMARTY_GRID_CONFIG');
        // run page command
        if (typeof(params) !== 'number') {
          this.log('Page size format error.');
        } else {
          config.pageSize = params;
        }
        this.setHash(config);
      } else if (typeof(args) === 'string' && args === 'appendQueryObj') {
        var config = $(this).data('SMARTY_GRID_CONFIG');
        // run page command
        if (typeof(params) !== 'object') {
          this.log('Page size format error.');
        } else {
          config.appendQueryObj = params;
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
      var hashObject = {}, config = $(this).data('SMARTY_GRID_CONFIG'), hashString;

      hashObject.pageCode = obj.pageCode;
      hashObject.pageSize = obj.pageSize;

      if (typeof(config.searchKeyword) === 'string' && config.searchFields.length > 0) {
        hashObject.searchKeyword = obj.searchKeyword.trim();
      } else {
        delete obj.searchKeyword;
      }

      if (typeof(config.appendQueryObj) === 'object' && config.appendQueryObj !== null) {
        hashObject.appendQueryObj = obj.appendQueryObj;
      } else {
        delete obj.appendQueryObj;
      }

      if (typeof(obj.sortFields) === 'object') {
        hashObject.sortFields = [];
        for (var j in obj.sortFields) {
          if (typeof(obj.sortFields[j]) === 'string') {
            hashObject.sortFields.push(obj.sortFields[j]);
          }
        }
        hashObject.order = obj.order;
      }

      hashString = JSON.stringify(hashObject);
  
      if (hashString === JSON.stringify(this.getHash())) {
        this.log('Hash is equal, force reload.');
        this.render();
      } else {
        window.location.hash = '#' + hashString;
      }
    };

    /**
     * Render table headers
     */
    this.renderHeader = function () {
      var i, config = $(this).data('SMARTY_GRID_CONFIG'), columns = config.columns, html, th;

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
          var tableHeadThHtml = config.tableHeadThHtml;
          if (typeof(columns[i].tableHeadThHtml) === 'string') {
            tableHeadThHtml = columns[i].tableHeadThHtml;
          }
          var tableCheckBoxThHtml = config.tableCheckBoxThHtml;
          if (typeof(columns[i].tableCheckBoxThHtml) === 'string') {
            tableCheckBoxThHtml = columns[i].tableCheckBoxThHtml;
          }

          var sortHtml = '';
          if (columns[i].sortable) {
            sortHtml += '<span class="sort-icon" style="cursor: pointer;">';
            if (typeof(config.sortFields) === 'object') {
              var found = false;
              for (var j in config.sortFields) {
                if (typeof(config.sortFields[j]) === 'string') {
                  if (typeof(columns[i].index) === 'string'
                    && config.sortFields[j] === columns[i].index
                  ) {
                    found = true;
                  } else if (typeof(columns[i].index) === 'object') {
                    for (var k in columns[i].index) {
                      if (config.sortFields[j] === columns[i].index[k]) {
                        found = true;
                      }
                    }
                  }
                }
              }
              if (!found) {
                sortHtml += config.sortDefaultHtml;
              } else {
                if (config.order === 'ASC') {
                  sortHtml += config.sortUpHtml;
                } else {
                  sortHtml += config.sortDownHtml;
                }
              }
            }
            sortHtml += '</span>';
          }

          if (columns[i].type === 'HIDDEN') {
            continue;
          } else if (columns[i].type === 'CHECKBOX') {
            // render checkbox selector
            if (columns[i].renderHeader && typeof(columns[i].renderHeader) === 'function') {
              html = columns[i].renderHeader(sortHtml);
            } else {
              html = tableCheckBoxThHtml + config.checkBoxHtml + '</th>';
            }
            $(this).find('thead tr:first').append(html);
            $(this).find('thead tr th:last').addClass('smarty-grid-th-' + i);
            $('.smarty-grid-checkbox-all').click(function (event) {
              if (typeof($(this).prop('checked')) === 'undefined' || $(this).prop('checked') === false || $(this).prop('checked') === null) {
                $('.smarty-grid-checkbox').prop('checked', false);
              } else {
                $('.smarty-grid-checkbox').prop('checked', true);
              }
              event.stopPropagation();
            });
          } else if (columns[i].renderHeader && typeof(columns[i].renderHeader) === 'function') {
            html = columns[i].renderHeader(sortHtml);
            $(this).find('thead tr:first').append(html);
            $(this).find('thead tr th:last').addClass('smarty-grid-th-' + i);
          } else {
            html = tableHeadThHtml + columns[i].title;
            html += sortHtml + '</th>';

            $(this).find('thead tr:first').append(html);
            
          }

          // bind sort event
          if (columns[i].sortable) {

            th = $(this).find('thead tr th:last');
            th.addClass('smarty-grid-th-' + i);
            th.data('index', columns[i].index);

            // save index value
            $('smarty-grid-th-' + i + ' .sort-icon').data('index', columns[i].index);
            th.click(function () {
              var config = $(this).parents('table').parent().data('SMARTY_GRID_CONFIG'),
                thIndex = $(this).data('index'),
                hashObj;

              // reset all sort icon
              $(this).parent().find('.sort-icon').html(config.sortDefaultHtml);

              if (config.order === 'ASC') {
                config.order = 'DESC';
                $(this).find('.sort-icon').html(config.sortDownHtml);
              } else {
                config.order = 'ASC';
                $(this).find('.sort-icon').html(config.sortUpHtml);
              }

              hashObj = self.getHash();
              hashObj.order = config.order;

              if (typeof(thIndex) === 'string') {
                hashObj.sortFields = [thIndex];
              } else if (typeof(thIndex) === 'object' && typeof(thIndex[0]) === 'string') {
                hashObj.sortFields = [thIndex[0]];
              }

              self.setHash(hashObj);
            });
          }

        }
      }
    };

    // render pager component
    this.renderPager = function (config) {
      var i, start, end, html = '', first = 1, last = Math.ceil(config.total / config.pageSize), hashObj;

      $(this).find(config.pagerQuery).children().remove();

      if (config.pager && typeof(config.total) !== 'undefined') {

        hashObj = this.getHash();

        //fixed pageCode
        if (config.pageCode > last) {
          config.pageCode = last;
        }
        if (config.pageCode < first) {
          config.pageCode = first;
        }

        //display first button
        if (config.pageCode === first || config.total === 0) {
          html += config.pagerStartHtml(false);
          html += config.pagerPrevHtml(false);
        } else {
          hashObj.pageCode = first;
          html += config.pagerStartHtml('#' + JSON.stringify(hashObj));
          hashObj.pageCode = config.pageCode - 1;
          html += config.pagerPrevHtml('#' + JSON.stringify(hashObj));
        }

        //display middle button
        start = first;
        end = last;
        if (Math.ceil(config.total / config.pageSize) > config.delta) {
          if (config.pageCode - Math.ceil(config.delta / 2) < first) {
            end = config.delta;
          } else if ((config.pageCode + Math.ceil(config.delta / 2) - 1) > last) {
            start = last - config.delta + 1;
          } else {
            start = config.pageCode - Math.ceil(config.delta / 2);
            end = config.pageCode + Math.ceil(config.delta / 2) - 1;
          }
        }
        for (i = start; i <= end; i++) {
          if (i === config.pageCode) {
            html += config.pagerNoHtml(false, i);
          } else {
            hashObj.pageCode = i;
            html += config.pagerNoHtml('#' + JSON.stringify(hashObj), i);
          }
        }

        //display last button
        if (config.pageCode === last || config.total === 0) {
          html += config.pagerNextHtml(false);
          html += config.pagerEndHtml(false);
        } else {
          hashObj.pageCode = config.pageCode + 1;
          html += config.pagerNextHtml('#' + JSON.stringify(hashObj));
          hashObj.pageCode = last;
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
        html += '<td class="' + config['class'] + '">';
      } else {
        html += '<td>';
      }
      html += '<input type="checkbox" name="' + name + '[]" value="' + value + '" class="smarty-grid-checkbox smarty-grid-row-' + index + '" /></td>';
      return html;
    };

    this.renderRows = function (config, model) {
      var columns = config.columns, html = '', value, i, j, k, string = '', arr = [];
      $(this).find('tbody').children().remove();
      $(this).data('SMARTY_GRID_ROWS', model);
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

              if (columns[j].type === 'CHECKBOX') {
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
      var config = $.extend($(this).data('SMARTY_GRID_CONFIG'), this.getHash());

      var uri = config.uri + (config.uri.indexOf('?') === -1 ? '?' : '') + (config.appendQueryObj !== null && $.param(config.appendQueryObj).length > 0 ? '&' + $.param(config.appendQueryObj) : ''),
        apiCallback = config.apiCallback,
        parent = this,
        offset = null,
        index = null,
        i = null,
        j = null,
        data,
        queryObject,
        pageCode;

      // check page code
      if (this.getHash() === null || typeof(this.getHash()) === 'undefined' || typeof(this.getHash().pageCode) === 'undefined') {
        pageCode = 1;
      } else {
        pageCode = parseInt(this.getHash().pageCode, 10);
      }
      if (config.total !== undefined && config.total !== 0 &&
        (typeof(pageCode) === 'undefined' || pageCode <= 0 || pageCode > (Math.ceil(config.total / config.pageSize)))) {
        this.log('pageCode error: ' + pageCode);
        return;
      }
      config.pageCode = pageCode;

      // make query object
      offset = (config.pageCode - 1) * config.pageSize;
      queryObject = {
        offset: offset,
        size: config.pageSize,
        pageCode: config.pageCode
      };

      // make sort column
      if (typeof(config.sortFields) === 'object') {
        queryObject.sorts = {};
        for (var i in config.sortFields) {
          if (typeof(config.sortFields[i]) === 'string') {
            queryObject.sorts[config.sortFields[i]] = config.order;
          }
        }
      }

      // search
      if (typeof(config.searchKeyword) === 'string' && config.searchKeyword.length > 0 && config.searchFields.length > 0) {
        queryObject.search = {};
        for (index in config.searchFields) {
          if (config.searchFields.hasOwnProperty(index)) {
            queryObject.search[config.searchFields[index]] = config.searchKeyword.trim();
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
        for (i = offset; i < offset + config.pageSize; i++) {
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
          config.afterRender(config.total, data, config.pageCode, config.pageSize, {data: config.data});
        }
      } else if (typeof(apiCallback) === 'function') {
        apiCallback(
          (function () {
            return function (total, list, data) {
              if (typeof(total) === 'undefined' || typeof(list) === 'undefined') {
                self.log('SmartyGrid WebService data format error.');
              } else {
                // update total
                config.total = parseInt(total, 10);
                // render pager
                parent.renderRows(config, list);
                parent.renderPager(config);
                if (typeof(config.afterRender) === 'function') {
                  config.afterRender(config.total, list, config.pageCode, config.pageSize, {data: data});
                }
              }
            };
          })(),
          queryObject
        );
      } else {
        //call ajax to get data
        //ajax call
        $.ajax({
          dataType: "json",
          url: uri,
          data: queryObject,
          complete: function (jqXHR) {

            if (typeof(jqXHR.responseJSON) !== 'object') {
              self.log('SmartyGrid WebService error: Return data not a JSON.');
              return;
            }
            var data = jqXHR.responseJSON;

            if (typeof(data) !== 'object') {
              self.log('SmartyGrid WebService error: Return data not a JSON object.');
            } else if (typeof(data.code) === 'undefined') {
              self.log('SmartyGrid WebService format error. (code not found)');
            } else if (data.code !== 0) {
              if (typeof(config.ajaxErrorCallback) === 'function') {
                config.ajaxErrorCallback(data);
              }
            } else if (typeof(data.message) === 'undefined') {
              self.log('SmartyGrid WebService format error. (message not found)');
            } else if (typeof(data.data) === 'undefined') {
              self.log('SmartyGrid WebService format error. (data not found)');
            } else if (typeof(data.data.total) === 'undefined' || typeof(data.data.list) === 'undefined') {
              self.log('SmartyGrid WebService data format error.');
            } else {
              // update total
              config.total = parseInt(data.data.total, 10);
              // render pager
              parent.renderRows(config, data.data.list);
              parent.renderPager(config);
              if (typeof(config.afterRender) === 'function') {
                config.afterRender(config.total, data.data.list, config.pageCode, config.pageSize, data);
              }
            }
          }
        });
      }
    };

    // invoke main function
    this.main(args, params);

  });

};
