const src=function(filePath){return "../src/"+filePath};
const errors=function(filePath){return "../src/errors/"+filePath};

const chai=require('chai').assert;
//const assert=require('assert');
const Parser=require(src('index.js')).Parser;
const Parsed=require(src('parsed.js'));
const MissingValueError=require(errors('missingValueError.js'));
const MissingEndQuoteError=require(errors('missingEndQuoteError.js'));
const MissingKeyError=require(errors('missingKeyError.js'));
const MissingAssignmentOperatorError=require(errors('missingAssignmentOperatorError.js'));
const IncompleteKeyValuePairError=require(errors('incompleteKeyValuePairError.js'));

var kvParser;

describe("parse basic key values",function(){
  beforeEach(function(){
    kvParser=new Parser();
  });

  it("parses an empty string",function(){
    let actual=kvParser.parse("");
    chai.equal(0,actual.length());
  });

  it("parse key=value",function(){
    let actual=kvParser.parse("key=value");
    chai.equal("value",actual.key);
    chai.equal(1,actual.length());
  });

  it("parse when there are leading spaces before key",function(){
    let actual=kvParser.parse(" key=value");
    let expected=new Parsed();
    expected['key']='value';
    chai.deepEqual(expected,actual);
  });

  it("parse when there are spaces after key",function(){
    let expected=new Parsed();
    expected['key']='value';
    chai.deepEqual(expected,kvParser.parse("key =value"));
  });

  it("parse when there are spaces before and after key",function(){
    let expected=new Parsed();
    expected['key']='value';
    chai.deepEqual(expected,kvParser.parse(" key =value"));
  });

  it("parse when there are spaces before value",function(){
    let expected=new Parsed();
    expected['key']='value';
    chai.deepEqual(expected,kvParser.parse("key= value"));
  });

  it("parse when there are spaces after value",function(){
    let expected=new Parsed();
    expected['key']='value';
    chai.deepEqual(expected,kvParser.parse("key=value "));
  });
});

describe("parse digits and other special chars",function(){
  beforeEach(function(){
    kvParser=new Parser();
  });

  it("parse keys with a single digit",function(){
    let expected=new Parsed();
    expected['1']='value';
    chai.deepEqual(expected,kvParser.parse("1=value"));
  });

  it("parse keys with only multiple digits",function(){
    let expected=new Parsed();
    expected['123']='value';
    chai.deepEqual(expected,kvParser.parse("123=value"));
  });

  it("parse keys with leading 0s",function(){
    let expected=new Parsed();
    expected['0123']='value';
    chai.deepEqual(expected,kvParser.parse("0123=value"));
  });

  it("parse keys with underscores",function(){
    let expected=new Parsed();
    expected['first_name']='value';
    chai.deepEqual(expected,kvParser.parse("first_name=value"));
  });

  it("parse keys with a single underscore",function(){
    let expected=new Parsed();
    expected['_']='value';
    chai.deepEqual(expected,kvParser.parse("_=value"));
  });

  it("parse keys with multiple underscores",function(){
    let expected=new Parsed();
    expected['__']='value';
    chai.deepEqual(expected,kvParser.parse("__=value"));
  });

  it("parse keys with alphabets and digits(digits leading)",function(){
    let expected=new Parsed();
    expected['0abc']='value';
    chai.deepEqual(expected,kvParser.parse("0abc=value"));
  });

  it("parse keys with alphabets and digits(alphabets leading)",function(){
    let expected=new Parsed();
    expected['a0bc']='value';
    chai.deepEqual(expected,kvParser.parse("a0bc=value"));
  });
});

describe("multiple keys",function(){
  beforeEach(function(){
    kvParser=new Parser();
  });

  it("parse more than one key",function(){
    let expected=new Parsed();
    expected['key']='value';
    expected['anotherkey']='anothervalue';
    chai.deepEqual(expected,kvParser.parse("key=value anotherkey=anothervalue"));
  });

  it("parse more than one key when keys have leading spaces",function(){
    let expected=new Parsed();
    expected['key']='value';
    expected['anotherkey']='anothervalue';
    chai.deepEqual(expected,kvParser.parse("   key=value anotherkey=anothervalue"));
  });

  it("parse more than one key when keys have trailing spaces",function(){
    let expected=new Parsed();
    expected['key']='value';
    expected['anotherkey']='anothervalue';
    chai.deepEqual(expected,kvParser.parse("key  =value anotherkey  =anothervalue"));
  });

  it("parse more than one key when keys have leading and trailing spaces",function(){
    let expected=new Parsed();
    expected['key']='value';
    expected['anotherkey']='anothervalue';
    chai.deepEqual(expected,kvParser.parse("  key  =value anotherkey  =anothervalue"));
  });
});

describe("single values with quotes",function(){
  beforeEach(function(){
    kvParser=new Parser();
  });

  it("parse a single value with quotes",function(){
    let expected=new Parsed();
    expected['key']='value';
    chai.deepEqual(expected,kvParser.parse("key=\"value\""));
  });

  it("parse a single quoted value that has spaces in it",function(){
    let expected=new Parsed();
    expected['key']='va lue';
    chai.deepEqual(expected,kvParser.parse("key=\"va lue\""));
  });

  it("parse a single quoted value that has spaces in it and leading spaces",function(){
    let expected=new Parsed();
    expected['key']='va lue';
    chai.deepEqual(expected,kvParser.parse("key=   \"va lue\""));
  });

  it("parse a single quoted value that has spaces in it and trailing spaces",function(){
    let expected=new Parsed();
    expected['key']='va lue';
    chai.deepEqual(expected,kvParser.parse("key=\"va lue\"   "));
  });
});

describe("multiple values with quotes",function(){
  it("parse more than one value with quotes",function(){
    let expected=new Parsed();
    expected['key']='va lue';
    expected['anotherkey']='another value';
    chai.deepEqual(expected,kvParser.parse("key=\"va lue\" anotherkey=\"another value\""));
  });

  it("parse more than one value with quotes with leading spaces",function(){
    let expected=new Parsed();
    expected['key']='va lue';
    expected['anotherkey']='another value';
    chai.deepEqual(expected,kvParser.parse("key= \"va lue\" anotherkey= \"another value\""));
  });

  it("parse more than one value with quotes when keys have trailing spaces",function(){
    let expected=new Parsed();
    expected['key']='va lue';
    expected['anotherkey']='another value';
    chai.deepEqual(expected,kvParser.parse("key = \"va lue\" anotherkey = \"another value\""));
  });
});

describe("mixed values with both quotes and without",function(){
  it("parse simple values with and without quotes",function(){
    let expected=new Parsed();
    expected['key']='value';
    expected['anotherkey']='anothervalue';
    chai.deepEqual(expected,kvParser.parse("key=value anotherkey=\"anothervalue\""));
  });

  it("parse simple values with and without quotes and leading spaces on keys",function(){
    let expected=new Parsed();
    expected['key']='value';
    expected['anotherkey']='anothervalue';
    chai.deepEqual(expected,kvParser.parse("   key=value anotherkey=\"anothervalue\""));
  });

  it("parse simple values with and without quotes and trailing spaces on keys",function(){
    let expected=new Parsed();
    expected['key']='value';
    expected['anotherkey']='anothervalue';
    chai.deepEqual(expected,kvParser.parse("key  =value anotherkey  =\"anothervalue\""));
  });

  it("parse simple values with and without quotes and leading and trailing spaces on keys",function(){
    let expected=new Parsed();
    expected['key']='value';
    expected['anotherkey']='anothervalue';
    chai.deepEqual(expected,kvParser.parse("  key  =value anotherkey  = \"anothervalue\""));
  });

  it("parse simple values with and without quotes(quoted values first)",function(){
    let expected=new Parsed();
    expected['key']='value';
    expected['anotherkey']='anothervalue';
    chai.deepEqual(expected,kvParser.parse("anotherkey=\"anothervalue\" key=value"));
  });
});

const errorChecker=function(key,pos,typeOfError) {
    return function(err) {
      if(err instanceof typeOfError && err.key==key && err.position==pos)
        return true;
      return false;
    }
}

describe("error handling",function(){
  beforeEach(function(){
    kvParser=new Parser();
  });

  it("throws error on missing value when value is unquoted",function(){
    try{
      chai.throws(()=>{
        kvParser.parse("key=")
      })
    }catch(err){
      chai.ok(errorChecker("key",3,MissingValueError)(err))
    }
  });

  it("throws error on missing value when value is quoted",function(){
    try{
      kvParser.parse("key=\"value")
    }catch(err){
      chai.ok(errorChecker("key",9,MissingEndQuoteError))
    }
  });

  it("throws error on missing key",function(){
    try{
      kvParser.parse("=value");
    }catch(err){
      chai.ok(errorChecker(undefined,0,MissingKeyError))
    }
  });

  it("throws error on invalid key",function(){
    try{
      kvParser.parse("'foo'=value");
    }catch(err){
      chai.ok(errorChecker(undefined,0,MissingKeyError))
    }
  });

  it("throws error on missing assignment operator",function(){
    try{
      kvParser.parse("key value");
    }catch(err){
      chai.ok(errorChecker(undefined,4,MissingAssignmentOperatorError))
    }
  });

  it("throws error on incomplete key value pair",function(){
    try{
      kvParser.parse("key");
    }catch(err){
      chai.ok(errorChecker(undefined,2,IncompleteKeyValuePairError))
    }
  });

});
