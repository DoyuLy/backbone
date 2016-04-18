define(["app"], function (CloudMamManager) {

    CloudMamManager.module("Entities", function (Entities, CloudMamManager, Backbone, Marionette, $, _) {
        Entities.FilteredCollection = function (options) {
            var original = options.collection;
            var filtered = new original.constructor();
            filtered.add(original.models);
            //这里做了一个投机取巧
            filtered.state = _.extend({}, original.state);
            filtered.filterFunction = options.filterFunction;
            filtered.listenTo(filtered.parameters, "change:criterion", function (params) {
                console.log("paarms:", params.attributes);
                console.log("change filter:", original);
                filtered.filter2(params.get("criterion"));
            });
            filtered.on("pagechange:before", function () {
                //获取页后重置


                original = filtered;


            });

            var applyFilter = function (filterCriterion, filterStrategy, collection) {
                var collection = collection || original;
                var criterion;

                if (filterStrategy == "filter") {
                    criterion = filterCriterion.trim();
                } else {
                    criterion = filterCriterion;
                }

                var items = [];
                if (criterion) {
                    if (filterStrategy == "filter") {
                        if (!filtered.filterFunction) {
                            throw("'filter' function is not defined");
                        }

                        var filterFunction = filtered.filterFunction(criterion);
                        items = collection.filter(filterFunction);

                    } else {
                        items = collection.where(criterion);
                    }
                }
                else {
                    items = collection.models;
                    console.log(collection);
                }

                filtered._currentCriterion = criterion;

                return items;
            };

            filtered.filter2 = function (filterCriterion) {


                filtered._currentFilter = "filter";

                var items = applyFilter(filterCriterion, "filter");

                filtered.reset(items);

                return filtered;
            };

            filtered.where = function (filterCriterion) {
                filtered._currentFilter = "where";
                var items = applyFilter(filterCriterion, "where");

                filtered.reset(items);

                return filtered;
            };


            original.on("reset", function () {

                var items = applyFilter(filtered._currentCriterion, filtered._currentFilter);

                filtered.reset(items);
            });

            original.on("change", function () {
                var items = applyFilter(filtered._currentCriterion, filtered._currentFilter);

                filtered.reset(items);
            });

            original.on("add", function (models) {

                var coll = new original.constructor();
                coll.add(models);

                var items = applyFilter(filtered._currentCriterion, filtered._currentFilter, coll);
                filtered.add(items);
            });

            return filtered;
        };

        Entities.BaseModel = Backbone.Model.extend({

        });

        //var originalSync = Backbone.sync;
        //Backbone.sync = function(method, model, options) {
        //	var deferred = $.Deferred();
        //	options || (options = {});

        //	deferred.then( options.success, options.error);

        //	var response = originalSync(method, model,_.omit(options,"success","error"));

        //	response.done(deferred.resolve);

        //	response.fail(function(){
        //		if(response.status  ==  401 ){
        //			console.log("认证失败，请重新登录");
        //		} else if( response.status ==403){
        //			console.log("未处理错误:",response.responseJSON.message);
        //		} else {
        //			deferred.rejectWith(response,arguments);
        //		}
        //	});
        //	return deferred.promise();
        //}
    });
    return CloudMamManager.Entities.FilteredCollection;
});
	