/*
 * Copyright 2015 Hewlett Packard Enterprise Development Company LP
 * Copyright 2016 Cray Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function () {
  'use strict';

  angular
      .module('horizon.dashboard.admin.ironic')
      .controller('horizon.dashboard.admin.ironic.NodeDetailsController',
          IronicNodeDetailsController);

  IronicNodeDetailsController.$inject = [
    '$scope',
    '$location',
    'horizon.app.core.openstack-service-api.ironic',
    'horizon.dashboard.admin.ironic.actions',
    'horizon.dashboard.admin.basePath'
  ];

  function IronicNodeDetailsController($scope, $location, ironic, actions, basePath) {
    var ctrl = this;
    var path = basePath + 'ironic/node-details/sections/';

    $scope.None = gettext('None');
    $scope.actions = actions;

    ctrl.sections = [
      {
        heading: gettext('Overview'),
        templateUrl: path + 'overview.html'
      },
      {
        heading: gettext('Configuration'),
        templateUrl: path + 'configuration.html'
      }
    ];

    console.log("sections = " + ctrl.sections.map(function(item) {return item['templateUrl'];}))
    ctrl.basePath = basePath;
    ctrl.init = init;

    ///////////////

    function init() {
      // Fetch the Node ID from the URL.
      var pattern = /(.*\/admin\/ironic\/)(.+)\/(detail)?/;
      var uuid = $location.absUrl().match(pattern)[2];

      retrieveNode(uuid).then(function () {
        retrievePorts(uuid);
      });
    }

    function retrieveNode(uuid) {
      return ironic.getNode(uuid).then(function (response) {
        var node = response.data;
        ctrl.node = $scope.node = node;
        if (node['target_power_state']) {
          actions.updateNode(node);
        }
      });
    }

    function retrievePorts(node_id) {
      return ironic.getPortsWithNode(node_id).then(function (response) {
        ctrl.ports = response.data.items;
      });
    }
  }

})();
