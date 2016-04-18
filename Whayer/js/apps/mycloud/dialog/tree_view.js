define(["app","config"], function (CloudMamManager,config) {
    CloudMamManager.module("MyCloudApp.Dialog.Tree", function (Tree, CloudMamManager, Backbone, Marionette, $, _) {
        //定义节点数据原型
        Tree.NodeModel = Backbone.Model.extend({
            defaults: {
                code: "-1",
                name: 'Root',
                children: [],   // Children are represented as ids not objects        
                parentId: -1,
                isSelected: false, //设置当前是否被选中
            },
            /* Return a suitable label for the Node
             * override this function to better serve the view
             */
            getLabel: function () {
                return this.get('name');
            },

            /* Return an array of actual TreeNodeModel instances
             * override this function depending on how children are store
             */
            getChildren: function () {
                var self = this;
                return _.map(this.get('children'), function (ref) {
                    // Lookup by ID in parent collection if string/num
                    if (typeof (ref) == 'string' || typeof (ref) == 'number') {                        
                        return self.collection.get(ref);
                    }

                    // Else assume its a real object
                    return ref;
                });
            }            
        });
        //定义节点数据集合
        Tree.NodeCollection = Backbone.Collection.extend({
            model: Tree.NodeModel,
            initialize: function () {
                this.selectedModel = null;//当前选中Model
            },
            toggleSelected: function (model) {//切换选中状态
                this.forEach(function (item) {//清除所有选中状态
                    item.set({ isSelected: false });
                });
                model.set({ isSelected: true });//设置当前为选中
                this.selectedModel = model;
            },
            getSelected: function () {//返回当前选中Model
                return this.selectedModel;
            }
        });
        
        //定义树形视图
        Tree.View = Backbone.View.extend({
            tagName: 'li',
            template: Marionette.TemplateCache.get("mycloud/mycloud-dialog-movetoform-file"),
            initialize: function () {
               
                this.model.bind('change:children', this.addSubTree, this);                

                //监听选中状态改变
                this.model.bind("change:isSelected", this.renderSelecteState, this);

            
                this.model.bind('change', this.update, this);

                this.model.view = this;//添加视图引用到模型
                //this.model.bind("destroy", this.test, this);
                
                // Collapse state
                this.collapsed = true;
                // Collapse setting
                this.COLLAPSE_SPEED = 50;
            },
            addNewFolder: function () {//新增文件夹  
                var self = this;
                var selectedNode = this.collection.getSelected();//返回当前选中节点
                if (selectedNode) {//异步新增文件夹
                    console.log(selectedNode);                    
                    var selectedNodeView = selectedNode.view;//选中节点视图

                    var node = new Tree.NodeModel({name:"新建文件夹",parentId:selectedNode.get("code")});
                    var nodeView = new Tree.View({
                        model:node
                    });
                    selectedNodeView.$("> .node-tree").prepend(nodeView.$el);
                    nodeView.render();                    
                    var html = "<input type='text'value='"+ node.get("name") + "'/>";
                    nodeView.$el.find("> .node-collapse").append(html);                            
                    nodeView.$el.find('.node-label').hide().next('input').show().focus().blur(function () {
                        var value = nodeView.$(this).val();
                        var el = nodeView.$el.find('.node-label');
                        var url =  config.dcmpRESTfulIp + '' + "/emc/folder";
                        Backbone.ajax(url, {
                            type: "POST",
                            data: JSON.stringify({ name: value, ParentFolderCode: selectedNode.get("code") }), // "parentFolderCode=" + selectedNode.get("code") + "&" + "name=" + value,
                            contentType: 'application/json',
                            success: function (data, textStatus, jqXHR) {//请求成功        
                                //el.text(value);
                                //el.show().next('input').hide().next('button').hide().next('button').hide();
                                selectedNodeView.loadChildrenNode(selectedNode);
                                
                            },
                            error: function () {
                                console.log("出错");
                            }
                        });
                    });
                  
                }
            },
            moveToFolder: function (list) {//移动到文件夹
                
                //console.log(list);
                var selectedNode = this.collection.getSelected();//返回当前选中
                //console.log(selectedNode);
                if (selectedNode) {
                    var isValid = true;
                    _.forEach(list, function (item) {//检索当前目录是否移动到自身或者其子文件下
                        if (item.isFolder) {
                            var moveFolder = new String(item.contentID);
                            var movetoFolder = new String(selectedNode.get("code"));
                            if (movetoFolder.indexOf(moveFolder) != -1) {
                                console.log("Don't allow to move!");
                                isValid = false;
                            }
                        }
                    });
                    if (!isValid) { return false; }
                    _.forEach(list, function (item) {
                        //console.log(item);
                        //item.attributes.type = code;
                        //console.log(config.dcmpRESTfulIp);
                        if (!item.isFolder) {
                            var url =  config.dcmpRESTfulIp + '' + "/emc/entity/" + item.contentID;//+ "?entity=" + selectedNode.get("code") + "&" + "type=move";
                            Backbone.ajax(url, {
                                type: "PUT",
                                data: JSON.stringify({ name: '', publicfolder: selectedNode.get("code") }),
                                contentType: 'application/json',
                                success: function (data, textStatus, jqXHR) {
                                    //console.log(data);
                                    console.log(item.view.model.collection);
                                    item.view.model.collection.forEach(function (model) {
                                        if (model.get("contentID") == selectedNode.get("code")) {
                                            var count = model.get("entityCount");
                                            count += 1;
                                            model.set({ entityCount: count });
                                            //item.view.model.collection.remove(model);
                                        }
                                    });
                                    item.view.remove();//关闭视图
                                }
                            });
                        } else {
                            var url =  config.dcmpRESTfulIp + '' + "/emc/folder/" + item.contentID;//+ "?entity=" + selectedNode.get("code") + "&" + "type=move";
                            Backbone.ajax(url, {
                                type: "PUT",
                                data: JSON.stringify({ code: item.contentID, name: '', ParentFolderCode: selectedNode.get("code") }),
                                contentType: 'application/json',
                                dataType: 'JSON',
                                success: function (data, textStatus, jqXHR) {
                                    //console.log(data);
                                    //console.log(item.view.model.collection);
                                    item.view.model.collection.forEach(function (model) {
                                        if (model.get("contentID") == selectedNode.get("code")) {//查找到当前选中的model
                                            var count = model.get("entityCount");
                                            count += item.view.model.get("entityCount");//将移动的文件夹数添加到移动到的里面
                                            model.set({ entityCount: count });
                                            //item.view.model.collection.remove(model);
                                        }
                                    });
                                    item.view.remove();//关闭视图
                                }
                            });
                        }
                    });
                    return true;
                }
            },
            renderSelecteState: function () {
                //console.log("This model has render Selecte State!");
                var state = this.model.get("isSelected");
                if (state) {
                    this.$el.find("> .node-collapse").addClass("node-active");
                } else {
                    this.$el.find("> .node-collapse").removeClass("node-active");
                }                
            },
            addSubTree: function () {//新增子树                
                this.renderChildren();//刷新节点                
            },
            loadChildrenNode: function (mainNode) {                
                //子节点
                var url =  config.dcmpRESTfulIp + '' + "/emc/folder/folder/" + mainNode.get("code");
                Backbone.ajax(url, {
                    type: "GET",
                    success: function (data, textStatus, jqXHR) {
                        //console.log(data);
                        var data = JSON.parse(data);//处理返回数据
                        var mainNodes = mainNode.collection;
                        //console.log("mainNodes", mainNodes);
                        //添加子节点到父节点
                        var subNodeIds = [];
                        data.forEach(function (item) {
                            mainNodes.add(item);
                            subNodeIds.push(item["id"]);
                        });
                        //console.log("mainNodes after add subNodes", mainNodes);
                        ////获取当前子节点所有的ID
                        //console.log(subNodeIds);
                        mainNodes.get(mainNode).set({ children: subNodeIds });
                        //console.log("mainNodes after add subNodes", mainNodes);
                        //self.toggleCollapse();
                    }
                });
            },
            setupEvents: function () {
                // Hack to get around event delegation not supporting ">" selector
                var self = this;

                //单击展开节点
                this.$('> .node-collapse i').click(function (e) {
                    e && e.stopPropagation();
                    //self.model.collection.toggleSelected(self.model);//切换节点选中状态
                    //self.toggleCollapse();
                    ////设置当前节点
                    if (self.collapsed) {//折叠时，请求数据
                        var mainNode = self.model;
                        self.loadChildrenNode(mainNode);//加载子节点
                        self.toggleCollapse();
                    } else {//展开时，折叠
                        self.model.collection.toggleSelected(self.model);//切换节点选中状态                        
                        self.toggleCollapse();
                    }
                });

                this.$('> .node-collapse').click(function () {
                    self.model.collection.toggleSelected(self.model);//切换节点选中状态
                    //self.toggleCollapse();
                });
                
                //this.$('> .node-label').click(function () { self.toggleCollapse(); });
                //双击刷新子节点
                this.$('> .node-collapse').dblclick(function () {
                    //设置当前节点                    
                    if (self.collapsed) {
                        var mainNode = self.model;
                        self.loadChildrenNode(mainNode);//加载子节点
                        self.toggleCollapse();
                    }
                });
            },

            toggleCollapse: function () {
                this.collapsed = !this.collapsed;
                if (this.collapsed) {
                    this.$('> .node-collapse i').attr('class', 'icon-plus');
                    this.$('> .node-tree').slideUp(this.COLLAPSE_SPEED);
                }
                else {
                    this.$('> .node-collapse i').attr('class', 'icon-minus');
                    this.$('> .node-tree').slideDown(this.COLLAPSE_SPEED);
                }
            },

            update: function () {
                this.$('> a .node-label').html(this.model.getLabel());
                this.collapsed && this.$('> .node-tree').hide() || this.$('> .node-tree').show();
            },

            render: function () {//刷新根节点下的子节点
                // Load HTML template and setup events
                this.$el.html(this.template);
                /* Apply some extra styling to views with children */
                this.$('> .node-collapse').prepend($('<i class="icon-plus">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</i>'));
                this.setupEvents();

                // Render this node
                this.update();                          

                //return this;
            },
            renderChildren: function () {//刷新父节点下的子节点
                //this.$el.html(this.template);
                //this.setupEvents();

                //// Render this node
                //this.update();
                // Build child views, insert and render each

                var tree = this.$('> .node-tree');
                tree.empty();
                var childView = null;
                _.each(this.model.getChildren(), function (model) {
                    //if (model) {
                        childView = new Tree.View({
                            model: model,
                        });                        
                        tree.append(childView.$el);
                        childView.render();
                    //}
                });
                /* Apply some extra styling to views with children */
                //this.$('> .node-collapse').prepend($('<i class="icon-plus"/>'));
                if (childView) {
                    // Add bootstrap plus/minus icon
                    //this.$('> .node-collapse').prepend($('<i class="icon-plus"/>'));

                    // Fixup css on last item to improve look of tree
                    childView.$el.addClass('last-item').before($('<li/>').addClass('dummy-item'));
                }

            }

        });

    });
    return CloudMamManager.MyCloudApp.Dialog.Tree;
});