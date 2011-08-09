if(typeof mljson == "undefined" || !mljson) {
    mljson = {};
}

mljson.queries = [
    {
        "query": 'foo',
        "result": '<cts:word-query xmlns:cts="http://marklogic.com/cts"> <cts:text xml:lang="en">foo</cts:text></cts:word-query>',
        "purpose": "Simple word query"
    },
    {
        "query": '"foo bar"',
        "result": '<cts:word-query xmlns:cts="http://marklogic.com/cts"> <cts:text xml:lang="en">foo bar</cts:text></cts:word-query>',
        "purpose": "Simple phrase query"
    },
    {
        "query": 'foo bar',
        "result": '<cts:and-query xmlns:cts="http://marklogic.com/cts"> <cts:word-query> <cts:text xml:lang="en">foo</cts:text> </cts:word-query> <cts:word-query> <cts:text xml:lang="en">bar</cts:text> </cts:word-query></cts:and-query>',
        "purpose": "Implicit AND query"
    },
    {
        "query": 'foo AND bar',
        "result": '<cts:and-query xmlns:cts="http://marklogic.com/cts"> <cts:word-query> <cts:text xml:lang="en">foo</cts:text> </cts:word-query> <cts:word-query> <cts:text xml:lang="en">bar</cts:text> </cts:word-query></cts:and-query>',
        "purpose": "Explicit AND query"
    },
    {
        "query": 'foo OR bar',
        "result": '<cts:or-query xmlns:cts="http://marklogic.com/cts"> <cts:word-query> <cts:text xml:lang="en">foo</cts:text> </cts:word-query> <cts:word-query> <cts:text xml:lang="en">bar</cts:text> </cts:word-query></cts:or-query>',
        "purpose": "Explicit OR query"
    },
    {
        "query": 'foo NEAR bar',
        "result": '<cts:near-query distance="10" xmlns:cts="http://marklogic.com/cts"> <cts:and-query> <cts:word-query> <cts:text xml:lang="en">foo</cts:text> </cts:word-query> <cts:word-query> <cts:text xml:lang="en">bar</cts:text> </cts:word-query> </cts:and-query></cts:near-query>',
        "purpose": "Explicit NEAR query"
    },
    {
        "query": 'foo NEAR/5 bar',
        "result": '<cts:near-query distance="5" xmlns:cts="http://marklogic.com/cts"> <cts:and-query> <cts:word-query> <cts:text xml:lang="en">foo</cts:text> </cts:word-query> <cts:word-query> <cts:text xml:lang="en">bar</cts:text> </cts:word-query> </cts:and-query></cts:near-query>',
        "purpose": "Explicit NEAR query with distance"
    },
    {
        "query": 'foo (bar OR baz)',
        "result": '<cts:and-query xmlns:cts="http://marklogic.com/cts"> <cts:word-query> <cts:text xml:lang="en">foo</cts:text> </cts:word-query> <cts:or-query> <cts:word-query> <cts:text xml:lang="en">bar</cts:text> </cts:word-query> <cts:word-query> <cts:text xml:lang="en">baz</cts:text> </cts:word-query> </cts:or-query></cts:and-query>',
        "purpose": "Grouping"
    },
    {
        "query": 'field1:foo',
        "result": '<cts:field-word-query xmlns:cts="http://marklogic.com/cts"> <cts:field>field1</cts:field> <cts:text xml:lang="en">foo</cts:text></cts:field-word-query>',
        "purpose": "Field constraint"
    },
    {
        "query": 'field1:foo OR field1:bar',
        "result": '<cts:or-query xmlns:cts="http://marklogic.com/cts"> <cts:field-word-query> <cts:field>field1</cts:field> <cts:text xml:lang="en">foo</cts:text> </cts:field-word-query> <cts:field-word-query> <cts:field>field1</cts:field> <cts:text xml:lang="en">bar</cts:text> </cts:field-word-query></cts:or-query>',
        "purpose": "Field constraint"
    },
    {
        "query": 'map1:foo',
        "result": '<cts:element-word-query xmlns:cts="http://marklogic.com/cts"> <cts:element xmlns:json="http://marklogic.com/json">json:name1</cts:element> <cts:text xml:lang="en">foo</cts:text></cts:element-word-query>',
        "purpose": "Map constraint"
    },
    {
        "query": 'range1:2007-01-25',
        "result": '<cts:element-attribute-range-query operator="&gt;" xmlns:cts="http://marklogic.com/cts"> <cts:element xmlns:json="http://marklogic.com/json">json:date1_003A_003Adate</cts:element> <cts:attribute>normalized-date</cts:attribute> <cts:value xsi:type="xs:dateTime" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">2007-01-25T00:00:00-07:00</cts:value></cts:element-attribute-range-query>',
        "purpose": "Date range constraint"
    },
    {
        "query": 'range2:foo',
        "result": '<cts:element-range-query operator="=" xmlns:cts="http://marklogic.com/cts"> <cts:element xmlns:json="http://marklogic.com/json">json:rangeKey</cts:element> <cts:value xsi:type="xs:string" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">foo</cts:value> <cts:option>collation=http://marklogic.com/collation/</cts:option></cts:element-range-query>',
        "purpose": "String range constraint"
    },
    {
        "query": 'range3:10',
        "result": '<cts:element-range-query operator="=" xmlns:cts="http://marklogic.com/cts"> <cts:element xmlns:json="http://marklogic.com/json">json:rangeKey</cts:element> <cts:value xsi:type="xs:decimal" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">10</cts:value></cts:element-range-query>',
        "purpose": "Number range constraint"
    },
    {
        "query": 'range4:foo',
        "result": '<cts:element-range-query operator="=" xmlns:cts="http://marklogic.com/cts"> <cts:element>rangeKey</cts:element> <cts:value xsi:type="xs:string" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">foo</cts:value> <cts:option>collation=http://marklogic.com/collation/</cts:option></cts:element-range-query>',
        "purpose": "XML element range constraint"
    },
    {
        "query": 'range5:foo',
        "result": '<cts:element-range-query operator="=" xmlns:cts="http://marklogic.com/cts"> <cts:element xmlns:testns="http://test.ns/uri">testns:rangeEl</cts:element> <cts:value xsi:type="xs:string" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">foo</cts:value> <cts:option>collation=http://marklogic.com/collation/</cts:option></cts:element-range-query>',
        "purpose": "Namespaced XML element range constraint"
    },
    {
        "query": 'range6:foo',
        "result": '<cts:element-attribute-range-query operator="=" xmlns:cts="http://marklogic.com/cts"> <cts:element xmlns:testns="http://test.ns/uri">testns:rangeEl</cts:element> <cts:attribute>rangeAttrib</cts:attribute> <cts:value xsi:type="xs:string" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">foo</cts:value> <cts:option>collation=http://marklogic.com/collation/</cts:option></cts:element-attribute-range-query>',
        "purpose": "Namespaced XML attribute range constraint"
    },
    {
        "query": 'fromBucket:G-M',
        "result": '<cts:and-query xmlns:cts="http://marklogic.com/cts"> <cts:element-range-query operator="&gt;="> <cts:element xmlns:json="http://marklogic.com/json">json:fromPersonal</cts:element> <cts:value xsi:type="xs:string" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">G</cts:value> <cts:option>collation=http://marklogic.com/collation/</cts:option> </cts:element-range-query> <cts:element-range-query operator="&lt;"> <cts:element xmlns:json="http://marklogic.com/json">json:fromPersonal</cts:element> <cts:value xsi:type="xs:string" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">N</cts:value> <cts:option>collation=http://marklogic.com/collation/</cts:option> </cts:element-range-query></cts:and-query>',
        "purpose": "Explicitly defined bucket constraint"
    },
    {
        "query": 'fromBucketXML:G-M',
        "result": '<cts:and-query xmlns:cts="http://marklogic.com/cts"> <cts:element-attribute-range-query operator="&gt;="> <cts:element>from</cts:element> <cts:attribute>personal</cts:attribute> <cts:value xsi:type="xs:string" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">G</cts:value> <cts:option>collation=http://marklogic.com/collation/</cts:option> </cts:element-attribute-range-query> <cts:element-attribute-range-query operator="&lt;"> <cts:element>from</cts:element> <cts:attribute>personal</cts:attribute> <cts:value xsi:type="xs:string" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">N</cts:value> <cts:option>collation=http://marklogic.com/collation/</cts:option> </cts:element-attribute-range-query></cts:and-query>',
        "purpose": "Explicitly defined bucket attribute constraint"
    },
    {
        "query": 'messageDate:"Sep 01 2010 - Oct 01 2010"',
        "result": '<cts:and-query xmlns:cts="http://marklogic.com/cts"> <cts:element-attribute-range-query operator="&gt;="> <cts:element xmlns:json="http://marklogic.com/json">json:date_003A_003Adate</cts:element> <cts:attribute>normalized-date</cts:attribute> <cts:value xsi:type="xs:dateTime" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">2010-09-01T00:00:00</cts:value> </cts:element-attribute-range-query> <cts:element-attribute-range-query operator="&lt;"> <cts:element xmlns:json="http://marklogic.com/json">json:date_003A_003Adate</cts:element> <cts:attribute>normalized-date</cts:attribute> <cts:value xsi:type="xs:dateTime" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">2010-10-01T00:00:00</cts:value> </cts:element-attribute-range-query></cts:and-query>',
        "purpose": "Explicitly defined bucket attribute constraint"
    }
];

$(document).ready(function() {
    module("Queries");
    for (var i = 0; i < mljson.queries.length; i += 1) {
        mljson.queryFromServerTest(mljson.queries[i]);
    }
});


mljson.queryFromServer = function(test, success, error) {
    asyncTest(test.purpose, function() {
        $.ajax({
            url: '/test/xq/parsequerystring.xqy',
            data: {"q": test.query},
            success: success,
            error: error,
            complete: function() { start(); }
        });
    });
};

mljson.queryFromServerTest = function(test) {
    mljson.queryFromServer(test,
        function(data, t, j) {
            if(test.error !== undefined) {
                equals(data, test.error, test.purpose);
            }
            else if(test.result !== undefined) {
                equals(data, test.result, test.purpose);
            }
        },
        function(j, t, e) { ok(false, e); console.log(e); } 
    );
};