var app = angular.module("app", ["kendo.directives"]);

app.directive('gridScreen', function() {
  return {
    restrict: 'E',
    link: function(scope, element, attributes, controller) { // defaulted post link
      scope.$broadcast('grid-options-ready', controller.getGridOptions());
      console.log('linked gridScreen');
    },
    controllerAs: 'gridScreen',
    controller: function($scope) {
      var gridOptions = {};

      this.getGridOptions = function() {
        return gridOptions;
      };

      this.refresh = function() {
        console.log('refresh');
      };

      this.create = function() {
        console.log('create');
      };

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
        }
      };
      this.setColumns = function(columns) {
        gridOptions.columns = columns;
      };
    }
  };
});

app.directive('inlineEditor', function() {
  return {
    restrict: 'A',
    require: '^gridScreen',
    link: function(scope, element, attributes, gridScreenController) {
      gridScreenController.setInlineEditor("<div ng-init=\"notification = dataItem\">\n<input type=\"text\" ng-model=\"notification.name\" />\n<input type=\"text\" ng-model=\"notification.subject\" />\n<textarea ng-model=\"notification.body\"></textarea>\n</div>");
    }
  };
});

app.directive('gridToolbar', function() {
  return {
    restrict: 'E',
    require: ['^gridScreen', 'gridToolbar'],
    link: function(scope, element, attributes, controllers) {
      var gridScreenController = controllers[0];
      var gridToolbarController = controllers[1];
      gridScreenController.setToolbar(
        gridToolbarController.getToolbarButtons().reduce(function(buttons, b) {
          return buttons + b;
        }, "")
      );
      console.log('linked gridToolbar');
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
});

app.directive('gridToolbarButton', function() {
  return {
    restrict: 'E',
    require: '^gridToolbar',
    link: function(scope, element, attributes, gridToolbarController) {
      gridToolbarController.addToolbarButton(
        '<button class="k-button" ng-click="gridScreen.' + attributes.action + '()">' +
          attributes.name +
        '</button>'
      );
      console.log('linked gridToolbarButton');
    }
  };
});

app.directive('gridColumns', function() {
  return {
    restrict: 'E',
    require: ['^gridScreen', 'gridColumns'],
    link: function(scope, element, attributes, controllers) {
      controllers[0].setColumns(controllers[1].getColumns());
      console.log('linked gridColumns');
    },
    controller: function() {
      var gridColumns = [];

      this.addColumn = function(col) {
        gridColumns.push(col);
      };

      this.getColumns = function() {
        return gridColumns;
      };
    }
  };
});

app.directive('gridColumn', function() {
  return {
    restrict: 'E',
    require: '^gridColumns',
    link: function(scope, element, attributes, gridColumnsController) {
      gridColumnsController.addColumn({
        field: attributes.field,
        title: attributes.title
      });
      console.log('linked gridColumn');
    }
  };
});

app.directive('grid', function() {
  return {
    restrict: 'E',
    require: '^gridScreen',
    replace: true,
    template: "<div id=\"grid\" kendo-grid k-options=\"gridOptions\"></div>",
    link: function(scope, element, attributes, gridScreenController) {
      gridScreenController.setDataSource(attributes.url);
      scope.$on('grid-options-ready', function(e, gridOptions) {
        scope.gridOptions = gridOptions;
      });
      console.log('linked grid');
    }
  };
});
