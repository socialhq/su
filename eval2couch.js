<!DOCTYPE html>
<html>
  <head>
    <title>CouchDB jQuery Examples</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <script src="/_utils/script/json2.js"></script>
    <script src="/_utils/script/sha1.js"></script>
    <script src="/_utils/script/jquery.js?1.4.2"></script>
    <script src="/_utils/script/jquery.couch.js?0.11.0"></script>
    <script src="/_utils/script/jquery.dialog.js?0.11.0"></script>
  </head>
  <body>
  </body>
</html>

By default, CouchDB will use an empty string as its URL prefix. However, you can configure this before your first API call. For example:
$.couch.urlPrefix = "http://localhost:5984";
You will typically not want to change this value since the same-origin policy prevents you from accessing CouchDB databases hosted at a different origin.
Server API
Server Information
JavaScript example:
$.couch.info({
    success: function(data) {
        console.log(data);
    }
});
Resulting HTTP request:
GET http://localhost:5984/ 200 OK
Console output:
{
    "couchdb"="Welcome",
    "version"="1.1.0"
}
All DBs
JavaScript example:
$.couch.allDbs({
    success: function(data) {
        console.log(data);
    }
});
Resulting HTTP request:
GET http://localhost:5984/_all_dbs 200 OK
Console output:
[
    "_replicator",
    "_users"
]
User Signup
JavaScript example:
var userDoc = {
    _id: "org.couchdb.user:bob",
    name: "bob"
};
$.couch.signup(userDoc, "supersecurepassword", {
    success: function(data) {
        console.log(data);
    },
    error: function(status) {
        console.log(status);
    }
});
Resulting HTTP request:
PUT http://localhost:5984/_users/org.couchdb.user%3Abob 201 Created
Console output:
{
    "ok"=true,
    "id"="org.couchdb.user:bob",
    "rev"="1-230dc0625bd3c4aac735846cc152c296"
}
Login
JavaScript example:
$.couch.login({
    name: "bob",
    password: "supersecurepassword",
    success: function(data) {
        console.log(data);
    },
    error: function(status) {
        console.log(status);
    }
});
Resulting HTTP request:
POST http://localhost:5984/_session 200 OK
Console output:
{
    "ok":true,
    "name":"bob",
    "roles":[]
}
This will result in an AuthSession cookie being set and then sent back to the server on subsequent requests, authenticating the user on each request. The session length is 10 minutes by default, but can be set in CouchDB’s couch_httpd_auth.timeout configuration option.
Session
JavaScript example:
$.couch.session({
    success: function(data) {
        console.log(data);
    }
});
Resulting HTTP request:
GET http://localhost:5984/_session 200 OK
Console output:
{
    "ok":true,
    "userCtx":{
        "name":"bob",
         "roles":[]
    },
    "info":{
        "authentication_db":"_users",
        "authentication_handlers":[
            "oauth",
            "cookie",
            "default"
        ],
        "authenticated":"cookie"
    }
}
Logout
JavaScript example:
$.couch.logout({
    success: function(data) {
        console.log(data);
    }
});
Resulting HTTP request:
DELETE http://_:_@localhost:5984/_session 200 OK
Console output:
{
    "ok":true
}
This will set the AuthSession cookie to an empty string, effectively logging the client out.
Active Tasks
JavaScript example:
$.couch.activeTasks({
    success: function(data) {
        console.log(data);
    }
});
Resulting HTTP request:
GET http://localhost:5984/_active_tasks 200 OK
Console output:
[]
Server Configuration
JavaScript example:
$.couch.config({
    success: function(data) {
        console.log(data);
    }
}, "uuids", "algorithm");
Resulting HTTP request:
GET http://localhost:5984/_config/uuids/algorithm 200 OK
Console output:
"sequential"
The second and third parameters are the section and option parameters, respectively. Omit the option parameter if you’d like to retrieve the entire section. Omit both the section and option parameters if you’d like to see the entire server configuration. Add an optional fourth parameter to set the configuration option’s value, which will result in a PUT request with the value.
User DB
JavaScript example:
$.couch.userDb(function(data) {
    console.log(data);
});
Resulting HTTP request:
GET http://localhost:5984/_session 200 OK
Console output:
{
    "name"="_users",
    "uri"="../_users/"
}
The URI will be relative to the HTML executing the script.
New UUID
JavaScript example:
var uuid = $.couch.newUUID();
console.log(uuid);
Resulting HTTP request:
GET http://localhost:5984/_uuids?count=1 200 OK
Console output:
d12ee5ea1df6baa2b06451f44a0156fa
This function takes a count parameter as an optional first parameter. If the count parameter is greater than one, then it will keep a cache of UUIDs that will be returned on subsequent calls, rather than making another request to the server.
Replicate
JavaScript example:
$.couch.replicate("mydb", "otherdb", {
    success: function(data) {
        console.log(data);
    },
    error: function(status) {
        console.log(status);
    }
}, {
    create_target: true
});
Resulting HTTP request:
POST http://localhost:5984/_replicate 200 OK
Console output:
{
    "ok":true,
    "session_id":"705797bae87456c52f5b76f44fe5f245",
    "source_last_seq":27,
    "replication_id_version":2,
    "history":[
        {
            "session_id":"705797bae87456c52f5b76f44fe5f245",
            "start_time":"Wed, 13 Jul 2011 22:40:09 GMT",
            "end_time":"Wed, 13 Jul 2011 22:40:09 GMT",
            "start_last_seq":0,
            "end_last_seq":27,
            "recorded_seq":27,
            "missing_checked":0,
            "missing_found":14,
            "docs_read":14,
            "docs_written":14,
            "doc_write_failures":0
        }
    ]
}
Database API
Create Database
JavaScript example:
$.couch.db("mydb").create({
    success: function(data) {
        console.log(data);
    },
    error: function(status) {
        console.log(status);
    }
});
Resulting HTTP request:
PUT http://localhost:5984/mydb/ 201 Created
Console output:
{
    "ok":true
}
Database Info
JavaScript example:
$.couch.db("mydb").info({
    success: function(data) {
        console.log(data);
    }
});
Resulting HTTP request:
GET http://localhost:5984/mydb/ 200 OK
Console output:
{
    "db_name":"mydb",
    "doc_count":0,
    "doc_del_count":0,
    "update_seq":0,
    "purge_seq":0,
    "compact_running":false,
    "disk_size":79,
    "instance_start_time":"1310597000825187",
    "disk_format_version":5,
    "committed_update_seq":0
}
Save New Document
JavaScript example:
var doc = {};
$.couch.db("mydb").saveDoc(doc, {
    success: function(data) {
        console.log(data);
    },
    error: function(status) {
        console.log(status);
    }
});
Resulting HTTP request:
POST http://localhost:5984/mydb/ 201 Created
Console output:
{
    "ok":true,
    "id":"d12ee5ea1df6baa2b06451f44a019ab9",
    "rev":"1-967a00dff5e02add41819138abb3284d"
}
Open Document
JavaScript example:
$.couch.db("mydb").openDoc("d12ee5ea1df6baa2b06451f44a019ab9", {
    success: function(data) {
        console.log(data);
    },
    error: function(status) {
        console.log(status);
    }
});
Resulting HTTP request:
GET http://localhost:5984/mydb/d12ee5ea1df6baa2b06451f44a019ab9 200 OK
Console output:
{
    "_id":"d12ee5ea1df6baa2b06451f44a019ab9",
    "_rev":"1-967a00dff5e02add41819138abb3284d"
}
Note that the HTTP response includes an Etag HTTP header. If you do a subsequent request for the same document, and your client supports caching and conditional HTTP requests, then an If-None-Match header should be sent using the value from the previous response’s Etag header. If the document has not been modified, then CouchDB will send a 304 Not Modified response and no response body, saving bandwidth and speeding up the response.
Save Updated Document
JavaScript example:
var doc = {
    _id: "d12ee5ea1df6baa2b06451f44a019ab9",
    _rev: "1-967a00dff5e02add41819138abb3284d",
    foo: "bar"
};
$.couch.db("mydb").saveDoc(doc, {
    success: function(data) {
        console.log(data);
    },
    error: function(status) {
        console.log(status);
    }
});
Resulting HTTP request:
PUT http://localhost:5984/mydb/d12ee5ea1df6baa2b06451f44a019ab9 201 Created
Console output:
{
    "ok":true,
    "id":"d12ee5ea1df6baa2b06451f44a019ab9",
    "rev":"2-13839535feb250d3d8290998b8af17c3"
}
Remove Document
JavaScript example:
var doc = {
    _id: "d12ee5ea1df6baa2b06451f44a019ab9",
    _rev: "2-13839535feb250d3d8290998b8af17c3"
};
$.couch.db("mydb").removeDoc(doc, {
     success: function(data) {
         console.log(data);
    },
    error: function(status) {
        console.log(status);
    }
});
Resulting HTTP request:
DELETE http://localhost:5984/mydb/d12ee5ea1df6baa2b06451f44a019ab9?rev=2-13839535… 200 OK
Console output:
{
    "id":d12ee5ea1df6baa2b06451f44a019ab9
    "ok":true,
    "rev":"3-1f04f977685e1108b4664f70b09c6f65"
}
Bulk Save
JavaScript example:
$.couch.db("mydb").bulkSave({"docs": [{}, {}]}, {
    success: function(data) {
        console.log(data);
    },
    error: function(status) {
        console.log(status);
    }
});
Resulting HTTP request:
POST http://localhost:5984/mydb/_bulk_docs?successStatus=201 201 Created
Console output:
[
    {
        "id":"d12ee5ea1df6baa2b06451f44a01a0d8",
        "rev":"1-967a00dff5e02add41819138abb3284d"
    },
    {
        "id":"d12ee5ea1df6baa2b06451f44a01a75a",
        "rev":"1-967a00dff5e02add41819138abb3284d"
    }
]
Bulk Remove
JavaScript example:
var docs = [
    {
        _id: "d12ee5ea1df6baa2b06451f44a01a0d8",
        _rev: "1-967a00dff5e02add41819138abb3284d"
    },
    {
        _id: "d12ee5ea1df6baa2b06451f44a01a75a",
        _rev: "1-967a00dff5e02add41819138abb3284d"
    }
];
$.couch.db("mydb").bulkRemove({"docs": docs}, {
    success: function(data) {
        console.log(data);
    },
    error: function(status) {
        console.log(status);
    }
});
Resulting HTTP request:
POST http://localhost:5984/mydb/_bulk_docs?successStatus=201 201 Created
Console output:
[
    {
        "id":"d12ee5ea1df6baa2b06451f44a01a0d8",
        "rev":"2-eec205a9d413992850a6e32678485900"
    },
    {
        "id":"d12ee5ea1df6baa2b06451f44a01a75a",
        "rev":"2-eec205a9d413992850a6e32678485900"
    }
]
This operates almost exactly like the bulk save, but instead sets the deleted flag to true on the documents.
All Documents
JavaScript example:
$.couch.db("mydb").allDocs({
    success: function(data) {
        console.log(data);
    }
});
Resulting HTTP request:
GET http://localhost:5984/mydb/_all_docs 200 OK
Console output:
{
    "total_rows":11,
    "offset":0,
    "rows":[
        {
            "id":"_design/default",
            "key":"_design/default",
            "value":{
                "rev":"9-5212dde9da06f1933dbe29811fc380d4"
            }
        },
        {
            "id":"d12ee5ea1df6baa2b06451f44a002cef",
            "key":"d12ee5ea1df6baa2b06451f44a002cef",
            "value":{
                "rev":"1-967a00dff5e02add41819138abb3284d"
            }
        },
        …
    ]
}
All Design Documents
JavaScript example:
$.couch.db("mydb").allDesignDocs({
    success: function(data) {
        console.log(data);
    }
});
Resulting HTTP request:
GET 
http://localhost:5984/mydb/_all_docs?startkey=%22_design%22&endkey=%22_design0%22 200 OK
Console output:
{
    "total_rows":11,
    "offset":0,
    "rows":[
        {
            "id":"_design/default",
            "key":"_design/default",
            "value":{
                "rev":"9-5212dde9da06f1933dbe29811fc380d4"
            }
        }
    ]
}
All Apps
JavaScript example:
$.couch.db("tutorial").allApps({
    success: function(data) {
        console.log(data);
    },
    eachApp: function(appName, appPath, ddoc) {
        console.log(appName);
        console.log(appPath);
        console.log(ddoc);
    }
});
Resulting HTTP requests:
GET http://localhost:5984/tutorial/_all_docs?startkey=%22_design%22&endkey=%22_design0%22 200 OK
GET http://localhost:5984/tutorial/_design/tutorial 200 OK
Console output:
tutorial
/tutorial/_design/tutorial/index.html
{
    "_id":"_design/tutorial",
    "_rev":"5-276897ecff6dc272c0b9143aa23e8a2e",
    …
}
This is intended as a convenience to find metadata about CouchApps.
Query
JavaScript example:
var mapFunction = function(doc) {
    emit();
};
$.couch.db("mydb").query(mapFunction, "_count", "javascript", {
    success: function(data) {
        console.log(data);
    },
    error: function(status) {
        console.log(status);
    },
    reduce: false
});
Resulting HTTP request:
POST http://localhost:5984/mydb/_temp_view?reduce=false 200 OK
Console output:
{
    "total_rows":10,
    "offset":0,
    "rows":[
        {
            "id":"d12ee5ea1df6baa2b06451f44a002cef",
            "key":null,
            "value":null
        },
        {
            "id":"d12ee5ea1df6baa2b06451f44a0037b5",
            "key":null,
            "value":null
        },
        {
            "id":"d12ee5ea1df6baa2b06451f44a003b06",
            "key":null,
            "value":null
        },
        …
    ]
}
This creates a temporary view as defined by your map and reduce functions. Temporary views are useful in development, but should be replaced with views permanently saved to design documents for production. Temporary views are slow, especially with a large number of documents.
View
JavaScript example:
$.couch.db("mydb").view("default/all", {
    success: function(data) {
        console.log(data);
    },
    error: function(status) {
        console.log(status);
    },
    reduce: false
});
Resulting HTTP request:
GET http://localhost:5984/mydb/_design/default/_view/all?reduce=false 200 OK
Console output:
{
    "total_rows":10,
    "offset":0,
    "rows":[
        {
            "id":"d12ee5ea1df6baa2b06451f44a002cef",
            "key":null,
            "value":null
        },
        {
            "id":"d12ee5ea1df6baa2b06451f44a0037b5",
            "key":null,
            "value":null
        },
        {
            "id":"d12ee5ea1df6baa2b06451f44a003b06",
            "key":null,
            "value":null
        },
        …
    ]
}
List
JavaScript example:
$.couch.db("mydb").list("default/all", "all", {
    success: function(data) {
        console.log(data);
    },
    error: function(status) {
        console.log(status);
    },
    reduce: false
});
Resulting HTTP request:
GET http://localhost:5984/mydb/_design/default/_list/all/all?reduce=false 200 OK
The console output will depend on your list’s behavior.
Compact
JavaScript example:
$.couch.db("mydb").compact({
    success: function(data) {
        console.log(data);
    }
});
Resulting HTTP request:
POST http://localhost:5984/mydb/_compact 202 Accepted
Console output:
{
    "ok":true
}
View Cleanup
JavaScript example:
$.couch.db("mydb").viewCleanup({
    success: function(data) {
        console.log(data);
    }
});
Resulting HTTP request:
POST http://localhost:5984/mydb/_view_cleanup 202 Accepted
Console output:
{
    "ok":true
}
Compact View
JavaScript example:
$.couch.db("mydb").compactView("default", {
    success: function(data) {
        console.log(data);
    }
});
Resulting HTTP request:
POST http://localhost:5984/mydb/_compact/default 202 Accepted
Console output:
{
    "ok":true
}
Changes
JavaScript example:
$.couch.db("mydb").changes().onChange(function(data) {
    console.log(data);
});
Resulting HTTP requests:
GET http://localhost:5984/mydb/ 200 OK
GET http://localhost:5984/mydb/_changes?heartbeat=10000&feed=longpoll&since=34 200 OK
This will keep a connection open until changes are detected, and then open up another connection to listen for subsequent changes starting from the next sequence.
Console output when a new document is created:
{
    "results":[
        {
            "seq":35,
            "id":"d12ee5ea1df6baa2b06451f44a01b7b5",
            "changes":[
                {
                    "rev":"1-967a00dff5e02add41819138abb3284d"
                }
            ]
        }
    ],
    "last_seq":35
}
This is very powerful feature. It allows you to listen for any changes to documents in the database and immediately respond to those changes.
Copy Document
JavaScript example:
$.couch.db("mydb").copyDoc("d12ee5ea1df6baa2b06451f44a01b7b5", {
    success: function(data) {
        console.log(data);
    },
    error: function(status) {
        console.log(status);
    }
}, {
    beforeSend: function(xhr) {
        xhr.setRequestHeader("Destination", "aNewDocId");
    }
});
Resulting HTTP request:
COPY http://localhost:5984/mydb/d12ee5ea1df6baa2b06451f44a01b7b5 201 Created
Console output:
{
    "id":"aNewDocId",
    "rev":"1-967a00dff5e02add41819138abb3284d"
}
Drop Database
JavaScript example:
$.couch.db("mydb").drop({
    success: function(data) {
        console.log(data);
    },
    error: function(status) {
        console.log(status);
    }
});
Resulting HTTP request:
DELETE http://localhost:5984/mydb/ 200 OK
Console output:
{
    "ok":true
}