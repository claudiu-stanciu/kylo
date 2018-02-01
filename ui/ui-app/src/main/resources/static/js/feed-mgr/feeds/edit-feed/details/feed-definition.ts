import * as angular from 'angular';
import 'pascalprecht.translate';
const moduleName = require('feed-mgr/feeds/edit-feed/module-name');


let directiveConfig = function() {
        return {
            restrict: "EA",
            bindToController: {
            },
            controllerAs: 'vm',
            scope: {},
            templateUrl: 'js/feed-mgr/feeds/edit-feed/details/feed-definition.html',
            controller: "FeedDefinitionController",
            link:  ($scope:any, element:any, attrs:any, controller:any) =>{

            }

        };
}
export class FeedDefinitionController implements ng.IComponentController
// define(['angular','feed-mgr/feeds/edit-feed/module-name', 'pascalprecht.translate'],  (angular:any,moduleName:any) =>
{

      /**
        * Indicates if the feed definitions may be edited.
        * @type {boolean}
        */
        allowEdit:boolean = false;
        model:any = this.FeedService.editFeedModel;
        editableSection :boolean = false;
        editModel:any = {};


    constructor(private $scope:any, private $q:any, private AccessControlService:any,private EntityAccessControlService:any, private FeedService:any, private $filter:any){

 
        $scope.$watch(()=>{
            return FeedService.editFeedModel;
        },(newVal:any) =>{
            //only update the model if it is not set yet
            if(this.model == null) {
                this.model = angular.copy(FeedService.editFeedModel);
            }
        })


    //Apply the entity access permissions
    $q.when(AccessControlService.hasPermission(AccessControlService.FEEDS_EDIT,this.model,AccessControlService.ENTITY_ACCESS.FEED.EDIT_FEED_DETAILS)).then((access:any) => {
        this.allowEdit = access && !this.model.view.generalInfo.disabled;
    });


            };

    

  



    onEdit(){
        //copy the model
        var copy = this.FeedService.editFeedModel;
        this.editModel= {};
        this.editModel.feedName = copy.feedName;
        this.editModel.systemFeedName = copy.systemFeedName;
        this.editModel.description = copy.description;
        this.editModel.templateId = copy.templateId;
    }
    
    onCancel() {
    
    }
    
    onSave(ev:any) {
        //save changes to the model
        this.FeedService.showFeedSavingDialog(ev, this.$filter('translate')('views.feed-definition.Saving'), this.model.feedName);
        var copy = angular.copy(this.FeedService.editFeedModel);
    
        copy.feedName = this.editModel.feedName;
        copy.systemFeedName = this.editModel.systemFeedName;
        copy.description = this.editModel.description;
        copy.templateId = this.editModel.templateId;
        copy.userProperties = null;
    
        this.FeedService.saveFeedModel(copy).then( (response:any) => {
            this.FeedService.hideFeedSavingDialog();
            this.editableSection = false;
            //save the changes back to the model
            this.model.feedName = this.editModel.feedName;
            this.model.systemFeedName = this.editModel.systemFeedName;
            this.model.description = this.editModel.description;
            this.model.templateId = this.editModel.templateId;
        },  (response:any) =>{
            this. FeedService.hideFeedSavingDialog();
            this.FeedService.buildErrorData(this.model.feedName, response);
            this.FeedService.showFeedErrorsDialog();
            //make it editable
            this.editableSection = true;
        });
    };




    
};

angular.module(moduleName).controller('FeedDefinitionController', ["$scope","$q","AccessControlService","EntityAccessControlService","FeedService", "$filter",FeedDefinitionController]);

    angular.module(moduleName)
        .directive('thinkbigFeedDefinition', directiveConfig);



    