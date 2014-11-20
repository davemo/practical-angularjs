angular.module("app", ["kendo.directives"])
  .directive('gridScreen', function() {
    return {
      restrict: 'E',
      link: function(scope, element, attributes, controller) {
        scope.$broadcast('grid-options-ready', controller.getGridOptions());
      },
      controllerAs: 'gridScreen',
      controller: function($scope) {
          var gridOptions = {};

          this.setInlineEditor = function(editorTemplate) {
            gridOptions.detailTemplate = editorTemplate;
          };

          this.setToolbar = function(toolbarTemplate) {
            gridOptions.toolbar = toolbarTemplate;
          };

          this.setDataSource = function(url) {
            gridOptions.dataSource = {
              schema: { data: "data" },
              transport: {
                read: { url: url, dataType: "json" }
              }
            };
          };

          this.setColumns = function(columns) {
            gridOptions.columns = columns;
          };

          this.getGridOptions = function() {
            return gridOptions;
          };

          this.create = function() {
            console.log('created');
          };

          this.refresh = function() {
            console.log('refresh');
          };
        }
    };
  })
  .directive('gridToolbarButton', function() {
    return {
      restrict: 'E',
      require: '^gridToolbar',
      link: function(scope, element, attributes, gridToolbarController) {
        gridToolbarController.addToolbarButton(
          '<button class="k-button" ng-click="gridScreen.' + attributes.action + '()">' +
            attributes.name +
          '</button>'
        );
      }
    };
  })
  .directive('gridToolbar', function() {
    return {
      restrict: 'E',
      require: ['^gridScreen', 'gridToolbar'],
      link: function(scope, element, attributes, controllers) {
        controllers[0].setToolbar(
            controllers[1].getToolbarButtons().reduce(function(buttons, b) {
              return buttons + b;
            }, "")
         );
      },
      controller: function() {
        var toolbarButtons = [];
        this.addToolbarButton = function(buttonMarkup) {
          toolbarButtons.push(buttonMarkup);
        };
        this.getToolbarButtons = function() {
          return toolbarButtons;
        };
      }
    };
  })
  .directive('gridColumns', function() {
    return {
      restrict: 'E',
      require: ['^gridScreen', 'gridColumns'],
      link: function (scope, element, attributes, controllers) {
        controllers[0].setColumns(controllers[1].getColumns());
      },
      controller: function () {
        var gridColumns = [];

        this.addColumn = function(col) {
          gridColumns.push(col);
        };

        this.getColumns = function() {
          return gridColumns;
        };
      }
    };
  })
  .directive('gridColumn', function() {
    return {
      restrict: 'E',
      require: '^gridColumns',
      link: function(scope, element, attributes, gridColumnsController) {
        console.log('linked a grid column');
        gridColumnsController.addColumn({
          field: attributes.field,
          title: attributes.title
        });
      }
    };
  })
  .directive('inlineEditor', function() {
    return {
      restrict: 'A',
      require: '^gridScreen',
      link: function(scope, element, attributes, gridScreenController) {
        gridScreenController.setInlineEditor("<div ng-init=\"notification = dataItem\">\n<input type=\"text\" ng-model=\"notification.name\" />\n<input type=\"text\" ng-model=\"notification.subject\" />\n<textarea ng-model=\"notification.body\"></textarea>\n</div>");
      }
    };
  })
  .directive('grid', function() {
    return {
      restrict: 'E',
      require: '^gridScreen',
      template: "<div id=\"grid\" kendo-grid k-options=\"gridOptions\"></div>",
      replace: true,
      link: function(scope, element, attributes, gridScreenController) {
        gridScreenController.setDataSource(attributes.url);
        scope.$on('grid-options-ready', function(e, gridOptions) {
          scope.gridOptions = gridOptions;
        });
      }
    };
  });
