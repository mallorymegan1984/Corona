if(typeof mljson == "undefined" || !mljson) {
    mljson = {};
}

mljson.removeIndexes = function(info, callback) {
    var i = 0;
    var indexes = [];
    for(i = 0; i < info.indexes.fields.length; i += 1) {
        indexes.push({"type": "field", "name": info.indexes.fields[i].name});
    }
    for(i = 0; i < info.indexes.mappings.length; i += 1) {
        indexes.push({"type": "map", "name": info.indexes.mappings[i].name});
    }
    for(i = 0; i < info.indexes.ranges.length; i += 1) {
        indexes.push({"type": "range", "name": info.indexes.ranges[i].name});
    }
    for(i = 0; i < info.indexes.bucketedRanges.length; i += 1) {
        indexes.push({"type": "bucketedrange", "name": info.indexes.bucketedRanges[i].name});
    }
    for(i = 0; i < info.xmlNamespaces.length; i += 1) {
        indexes.push({"type": "namespace", "name": info.xmlNamespaces[i].prefix});
    }
    
    var processingPosition = 0;

    var removeNextIndex = function() {
        removeIndex(processingPosition);
    };

    var removeIndex = function(pos) {
        var index = indexes[pos];
        if(index === undefined) {
            asyncTest("Check for no indexes", function() {
                $.ajax({
                    url: '/data/info',
                    success: function(data) {
                        var info = JSON.parse(data);
                        ok(info.indexes.fields.length === 0, "All fields removed");
                        ok(info.indexes.mappings.length === 0, "All mappings removed");
                        ok(info.indexes.ranges.length === 0, "All ranges removed");
                        ok(info.xmlNamespaces.length === 0, "All namespaces removed");
                        callback.call();
                    },
                    error: function() {
                        ok(false, "Could not fetch server info");
                    },
                    complete: function() { start(); }
                });
            });
            return;
        }

        asyncTest("Remove the " + index.name + " index", function() {
            var url = "/manage/" + index.type + "/" + index.name;
            $.ajax({
                url: url,
                type: 'DELETE',
                success: function() {
                    processingPosition++;
                    ok(true, "Removed the " + index.name + " " + index.type);
                    removeNextIndex();
                },
                error: function(j, t, error) {
                    ok(false, "Could not delete " + index.type + ": " + error);
                },
                complete: function() {
                    start();
                }
            });
        });
    }

    removeNextIndex();
};

mljson.addIndexes = function(callback) {
    // These are the index to try and create
    var indexes = [
        // Namespaces
        {
            "type": "namespace",
            "prefix": "test:ns",
            "uri": "http://test.ns/uri",
            "shouldSucceed": false,
            "purpose": "Should fail with invalid XML namespace prefix"
        },
        {
            "type": "namespace",
            "prefix": "testns",
            "uri": "http://test.ns/uri",
            "shouldSucceed": true,
            "purpose": "Creation of XML namespace"
        },

        // Fields
        {
            "type": "field",
            "name": "field1",
            "includes": [
                { "type": "key", "name": "included1"},
                { "type": "key", "name": "included2"},
                { "type": "element", "name": "nonselment"},
                { "type": "element", "name": "testns:nselement"}
            ],
            "excludes": [
                { "type": "key", "name": "excluded1"},
                { "type": "element", "name": "excludenonsel"},
                { "type": "element", "name": "testns:excludensel"}
            ],
            "shouldSucceed": true,
            "purpose": "Field with includes and excludes of JSON keys and XML elements, with and without namespaces",
        },
        {
            "type": "field",
            "name": "field2",
            "includes": [],
            "excludes": [],
            "shouldSucceed": false,
            "purpose": "Checking for at least one included key or element"
        },
        {
            "type": "field",
            "name": "field3",
            "includes": [
                { "type": "element", "name": "invalidns:included1"}
            ],
            "excludes": [],
            "shouldSucceed": false,
            "purpose": "Checking for bogus XML element names"
        },
        {
            "type": "field",
            "name": "field1",
            "includes": [
                { "type": "key", "name": "included1"}
            ],
            "excludes": [],
            "shouldSucceed": false,
            "purpose": "Making sure you can't have duplicate names when creating a field"
        },

        // Maps
        {
            "type": "map",
            "name": "map1",
            "key": "name1",
            "mode": "contains",
            "shouldSucceed": true,
            "purpose": "JSON contains map"
        },
        {
            "type": "map",
            "name": "map2",
            "element": "element1",
            "mode": "contains",
            "shouldSucceed": true,
            "purpose": "XML contains map"
        },
        {
            "type": "map",
            "name": "map3",
            "key": "name1",
            "mode": "equals",
            "shouldSucceed": true,
            "purpose": "JSON contains map"
        },
        {
            "type": "map",
            "name": "map4",
            "element": "element1",
            "mode": "equals",
            "shouldSucceed": true,
            "purpose": "XML contains map"
        },
        {
            "type": "map",
            "name": "map5",
            "element": "testns:element1",
            "mode": "equals",
            "shouldSucceed": true,
            "purpose": "XML contains map with valid namespace"
        },
        {
            "type": "map",
            "name": "map6",
            "element": "invalidns:element1",
            "mode": "equals",
            "shouldSucceed": false,
            "purpose": "XML contains map with invalid namespace"
        },
        {
            "type": "map",
            "name": "map7",
            "key": "name1",
            "mode": "invalidmode",
            "shouldSucceed": false,
            "purpose": "Checking for invalid map modes"
        },
        {
            "type": "map",
            "name": "field1",
            "key": "name1",
            "mode": "equals",
            "shouldSucceed": false,
            "purpose": "Making sure you can't have duplicate names when creating a map"
        },

        // Ranges
        {
            "type": "range",
            "name": "list",
            "key": "list",
            "datatype": "string",
            "operator": "eq",
            "shouldSucceed": true,
            "purpose": "Range index for MarkMail JSON message list"
        },
        {
            "type": "range",
            "name": "range1",
            "key": "date1::date",
            "datatype": "date",
            "operator": "gt",
            "shouldSucceed": true,
            "purpose": "JSON range creation on a date"
        },
        {
            "type": "range",
            "name": "range2",
            "key": "rangeKey",
            "datatype": "string",
            "operator": "eq",
            "shouldSucceed": true,
            "purpose": "JSON range creation on a string"
        },
        {
            "type": "range",
            "name": "range3",
            "key": "rangeKey",
            "datatype": "number",
            "operator": "eq",
            "shouldSucceed": true,
            "purpose": "JSON range creation on a number"
        },
        {
            "type": "range",
            "name": "range4",
            "element": "rangeKey",
            "datatype": "string",
            "operator": "eq",
            "shouldSucceed": true,
            "purpose": "XML element range creation on a string"
        },
        {
            "type": "range",
            "name": "range5",
            "element": "testns:rangeEl",
            "datatype": "string",
            "operator": "eq",
            "shouldSucceed": true,
            "purpose": "Namespaced XML element range creation on a string"
        },
        {
            "type": "range",
            "name": "range6",
            "element": "testns:rangeEl",
            "attribute": "rangeAttrib",
            "datatype": "string",
            "operator": "eq",
            "shouldSucceed": true,
            "purpose": "Namespaced XML element attribute range creation on a string"
        },
        {
            "type": "range",
            "name": "range7",
            "element": "invalidns:rangeEl",
            "attribute": "rangeAttrib",
            "datatype": "string",
            "operator": "eq",
            "shouldSucceed": false,
            "purpose": "Invalid XML element on a element attribute range index"
        },
        {
            "type": "range",
            "name": "range8",
            "element": "rangeEl",
            "attribute": "invalidns:rangeAttrib",
            "datatype": "string",
            "operator": "eq",
            "shouldSucceed": false,
            "purpose": "Invalid XML element on a element attribute range index"
        },
        {
            "type": "range",
            "name": "range8",
            "element": "rangeEl",
            "datatype": "string",
            "operator": "bogusoperator",
            "shouldSucceed": false,
            "purpose": "Invalid operator on a range index"
        },
        {
            "type": "range",
            "name": "field1",
            "key": "name1",
            "datatype": "string",
            "operator": "eq",
            "shouldSucceed": false,
            "purpose": "Making sure you can't have duplicate names when creating a range"
        },

        // Bucketed ranges
        {
            "type": "bucketedrange",
            "name": "fromBucket",
            "key": "fromPersonal",
            "datatype": "string",
            "buckets": "A-F|G|G-M|N|N-R|S|S-Z",
            "shouldSucceed": true,
            "purpose": "JSON key bucketed range creation on a string"
        },
        {
            "type": "bucketedrange",
            "name": "fromBucketXML",
            "element": "from",
            "attribute": "personal",
            "datatype": "string",
            "buckets": "A-F|G|G-M|N|N-R|S|S-Z",
            "shouldSucceed": true,
            "purpose": "Element/attribute bucketed range creation on a string"
        },
        {
            "type": "bucketedrange",
            "name": "messageDate",
            "key": "date::date",
            "datatype": "date",
            "startingAt": "1970-01-01T00:00:00-07:00",
            "firstFormat": "Before %b %d %Y",
            "format": "%b %d %Y - @b @d @Y",
            "lastFormat": "After %b %d %Y",
            "bucketInterval": "month",
            "shouldSucceed": true,
            "purpose": "Auto-bucketed range index for MarkMail JSON message date"
        }
    ];

    var compareIndexes = function(config, server) {
        if(config.type === "map") {
            if(config.key !== undefined) {
                equals(config.key, server.key, "Index key matches");
            }
            if(config.element !== undefined) {
                equals(config.element, server.element, "Index element matches");
            }
            equals(config.mode, server.mode, "Index mode matches");
        }
        else if(config.type === "range") {
            if(config.key !== undefined) {
                equals(config.key, server.key, "Index key matches");
            }
            if(config.element !== undefined) {
                equals(config.element, server.element, "Index element matches");
            }
            if(config.attribute !== undefined) {
                equals(config.attribute, server.attribute, "Index attribute matches");
            }
            equals(config.datatype, server.type, "Index datatype matches");
            equals(config.operator, server.operator, "Index operator matches");
        }
        else if(config.type === "bucketedrange") {
            equals(config.datatype, server.type, "Index datatype matches");
            if(config.key !== undefined) {
                equals(config.key, server.key, "Index key matches");
            }
            if(config.element !== undefined) {
                equals(config.element, server.element, "Index element matches");
            }
            if(config.attribute !== undefined) {
                equals(config.attribute, server.attribute, "Index attribute matches");
            }
            if(config.buckets !== undefined) {
                equals(config.buckets, server.buckets.join("|"), "Index buckets matches");
            }
            if(config.startingAt !== undefined) {
                equals(config.startingAt, server.startingAt, "Index starting date matches");
            }
            if(config.stoppingAt !== undefined) {
                equals(config.stoppingAt, server.stoppingAt, "Index stopping date matches");
            }
            if(config.bucketInterval !== undefined) {
                equals(config.bucketInterval, server.bucketInterval, "Index bucketInterval matches");
            }
            if(config.firstFormat !== undefined) {
                equals(config.firstFormat, server.firstFormat, "Index firstFormat matches");
            }
            if(config.format !== undefined) {
                equals(config.format, server.format, "Index format matches");
            }
            if(config.lastFormat !== undefined) {
                equals(config.lastFormat, server.lastFormat, "Index lastFormat matches");
            }
        }
        else if(config.type === "field") {
            deepEqual(config.includes, server.includedKeys, "Index includes matches");
            deepEqual(config.excludes, server.excludedKeys, "Index excludes matches");
        }
        else if(config.type === "namespace") {
            equal(config.prefix, server.prefix, "Namespace prefixes matches");
            equal(config.uri, server.uri, "Namespace uris matches");
        }
    };
    
    var processingPosition = 0;

    var addNextIndex = function() {
        addIndex(processingPosition);
    };

    var addIndex = function(pos) {
        var index = indexes[pos];

        if(index === undefined) {
            asyncTest("Checking created indexes", function() {
                $.ajax({
                    url: '/data/info',
                    context: this,
                    success: function(data) {
                        var info = JSON.parse(data);
                        var i = 0;
                        var j = 0;
                        for (i = 0; i < indexes.length; i += 1) {
                            var config = indexes[i];
                            if(!config.shouldSucceed) {
                                continue;
                            }
                            var foundIndex = false;
                            if(config.type === "namespace") {
                                for(j = 0; j < info.xmlNamespaces.length; j += 1) {
                                    var server = info.xmlNamespaces[j];
                                    if(server.prefix === config.prefix) {
                                        foundIndex = true;
                                        compareIndexes(config, server);
                                    }
                                }
                            }
                            else {
                                var pluralName = {
                                    "range": "ranges",
                                    "namespace": "xmlNamespaces",
                                    "field": "fields",
                                    "map": "mappings",
                                    "bucketedrange": "bucketedRanges"
                                }
                                for(j = 0; j < info.indexes[pluralName[config.type]].length; j += 1) {
                                    var server = info.indexes[pluralName[config.type]][j];
                                    if(server.name === config.name) {
                                        foundIndex = true;
                                        compareIndexes(config, server);
                                    }
                                }
                            }
                            if(!foundIndex) {
                                ok(false, "Could not find newly added index or namespace: " + config.name);
                            }
                        }
                        callback.call();
                    },
                    error: function() {
                        ok(false, "Could not check for added index or namespace");
                    },
                    complete: function() { start(); }
                });
            });
            return;
        }

        asyncTest(index.purpose, function() {
            var url = "/manage/" + index.type + "/" + index.name;
            var data = {};
            if(index.type === "namespace") {
                url = "/manage/" + index.type + "/" + index.prefix;
                data.uri = index.uri;
            }
            else if(index.type === "map") {
                if(index.key !== undefined) {
                    data.key = index.key;
                }
                if(index.element !== undefined) {
                    data.element = index.element;
                }
                data.mode = index.mode;
            }
            else if(index.type === "field") {
                data.includeKey = [];
                data.excludeKey = [];
                data.includeElement = [];
                data.excludeElement = [];

                var i = 0;
                for(i = 0; i < index.includes.length; i += 1) {
                    if(index.includes[i].type === "key") {
                        data.includeKey.push(index.includes[i].name);
                    }
                    else {
                        data.includeElement.push(index.includes[i].name);
                    }
                }
                for(i = 0; i < index.excludes.length; i += 1) {
                    if(index.excludes[i].type === "key") {
                        data.excludeKey.push(index.excludes[i].name);
                    }
                    else {
                        data.excludeElement.push(index.excludes[i].name);
                    }
                }
            }
            else if(index.type === "range") {
                if(index.key !== undefined) {
                    data.key = index.key;
                }
                if(index.element !== undefined) {
                    data.element = index.element;
                }
                if(index.attribute !== undefined) {
                    data.attribute = index.attribute;
                }
                data.type = index.datatype;
                data.operator = index.operator;
            }
            else if(index.type === "bucketedrange") {
                data.type = index.datatype;
                if(index.key !== undefined) {
                    data.key = index.key;
                }
                if(index.element !== undefined) {
                    data.element = index.element;
                }
                if(index.attribute !== undefined) {
                    data.attribute = index.attribute;
                }
                if(index.buckets !== undefined) {
                    data.buckets = index.buckets;
                }
                if(index.startingAt !== undefined) {
                    data.startingAt = index.startingAt;
                }
                if(index.stoppingAt !== undefined) {
                    data.stoppingAt = index.stoppingAt;
                }
                if(index.bucketInterval !== undefined) {
                    data.bucketInterval = index.bucketInterval;
                }
                if(index.firstFormat !== undefined) {
                    data.firstFormat = index.firstFormat;
                }
                if(index.format !== undefined) {
                    data.format = index.format;
                }
                if(index.lastFormat !== undefined) {
                    data.lastFormat = index.lastFormat;
                }
            }

            $.ajax({
                url: url,
                data: data,
                type: 'POST',
                context: index,
                success: function() {
                    if(this.shouldSucceed) {
                        ok(true, "Index/namespace was created");
                    }
                    else {
                        ok(false, "Index/namespace was created when it should have errored");
                    }
                    processingPosition++;
                    addNextIndex();
                },
                error: function(j, t, error) {
                    ok(!this.shouldSucceed, "Could not add index/namespace: " + error);
                    processingPosition++;
                    addNextIndex();
                },
                complete: function() {
                    start();
                }
            });
        });
    };

    addNextIndex();
};

mljson.insertDocuments = function() {
    var documents = [
        {
            "name1": "Musical Animals",
            "date1::date": "January 5th 1977",
            "included1": "chicken",
            "included2": {
                "animal": "snake",
                "excluded1": "mastodon"
            },
            "uri": "/document1.json"
        },
        {
            "name1": "Other Musical Animals",
            "date1::date": "January 5th 1977",
            "included1": "duck",
            "included2": {
                "animal": "snake",
                "excluded1": "mastodon"
            },
            "uri": "/document2.json"
        },
        {
            "name1": "Other Musical Animals",
            "date1::date": "January 7th 1977",
            "included1": "duck",
            "included2": {
                "animal": "snake",
                "excluded1": "mastodon"
            },
            "uri": "/document3.json"
        }
    ];
    
    var processingPosition = 0;

    var insertNextDocument = function() {
        addDocument(processingPosition);
    };

    var addDocument = function(pos) {
        var doc = documents[pos];

        if(doc === undefined) {
            return;
        }

        asyncTest("Inserting document: " + doc.uri, function() {
            $.ajax({
                url: "/json/store" + doc.uri,
                type: 'PUT',
                data: JSON.stringify(doc),
                success: function() {
                    ok(true, "Inserted document");
                    processingPosition++;
                    insertNextDocument();
                },
                error: function(j, t, error) {
                    ok(false, "Could not insert document");
                    processingPosition++;
                    insertNextDocument();
                },
                complete: function() {
                    start();
                }
            });
        });
    };

    insertNextDocument();
};

$(document).ready(function() {
    module("Database setup");
    asyncTest("Database index setup", function() {
        $.ajax({
            url: '/data/info',
            success: function(data) {
                var info = JSON.parse(data);
                mljson.removeIndexes(info, function() {
                    mljson.addIndexes(function() {
                        mljson.insertDocuments();
                    });
                });
            },
            error: function() {
                ok(false, "Could not fetch server info");
            },
            complete: function() { start(); }
        });
    });
});
