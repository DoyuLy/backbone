define(["localstorage"],function(){
	var findStorageKey = function(entity) {
		if(entity.urlRoot) {
			return _.result(entity,"urlRoot");
		}

		if(entity.url){
			return _.result(entity,"url");
		}

		if(entity.collection && entity.collection.url ){
			return _.result(entity.collection,"url");
		}
	}

	var StorageMixin = function(entityPrototype){

		var storageKey = findStorageKey(entityPrototype);

		return {
			localStorage: new Backbone.LocalStorage(storageKey)
		}
	};
	return configureStorage = function(entity){
		_.extend(entity.prototype, new StorageMixin(entity.prototype));
	}	
});

	