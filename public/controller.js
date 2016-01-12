var T2D = angular.module('T2D', []);

function mainController($scope, $http) {
    $scope.image = {url:"images/Toronto.jpg"};


    $scope.cities=[{name:"Toronto"},{name:"Waterloo"},{name:"Mississauga"}];
    $scope.regions=[{name:"Ontario"},{name:"New York"}, {name:"England"}, {name:"California"}];
    $scope.types=[{name:"Most Popular"}];
    $scope.currentCity = {text:"Toronto"};

    $scope.changedRegion=function(item) {
        if(item.name == "Ontario")
        {
            $scope.cities=[{name:"Toronto"},{name:"Waterloo"},{name:"Mississauga"}];
        }
        else if(item.name == "New York")
        {
            $scope.cities=[{name:"New York City"}];
        }
        else if(item.name == "England")
        {
            $scope.cities=[{name:"London"},{name:"Liverpool"}];
        }
        else if(item.name == "California")
        {
            $scope.cities=[{name:"Los Angeles"},{name:"San Francisco"}];
        }

    }

    $scope.changedValue=function(item){
        $scope.currentCity = {text:item.name};
        $scope.image = {url:"images/" + item.name + ".jpg"};
    }



    // when submitting the add form, send the text to the node API
    $scope.findThings = function() {
        $http.post('/api/scrape', $scope.currentCity)
            .success(function(data) {
                $scope.things = data;
                $scope.opts = data;
            })
            .error(function(data) {
            });
    };

}