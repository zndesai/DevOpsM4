const esprima = require("esprima");
const path = require("path");
var options = {tokens:true, tolerant: true, loc: true, range: true };
const fs = require("fs");
const recursiveReadSync = require('recursive-readdir-sync')
const colors = require('colors');

var fails = false;

function main()
{
	var args = process.argv.slice(2);
	var filePaths = [];
	
	if( args.length == 0 ) {
		filePaths = ["analysis.js"];
	} else {
		let allFilePaths = recursiveReadSync(path.join(__dirname, args[0]));
		allFilePaths.forEach((p)=>{
			if(path.basename(p).match(/[a-zA-Z0-9._/]+[.]js$/g)){
				filePaths.push(p)
			}
		})
	}
	
	filePaths.forEach((p)=>{
		complexity(p);
	})
	
	// Report
	console.log('\n\nFailes tests for functions:')
	for( var node in builders )
	{
		var builder = builders[node];
		if(isFailed(builder)){
			fails = true;
			builder.report();
		}
	}
	
	if(fails)
		process.exit(1);
}

var builders = {};

// Represent a reusable "class" following the Builder pattern.
function FunctionBuilder()
{
	this.StartLine = 0;
	this.EndLine = 0;
	this.bigo = -1;
	this.FunctionName = "";
	// The number of parameters for functions
	this.ParameterCount  = 0,
	// Number of if statements/loops + 1
	this.SimpleCyclomaticComplexity = 0;
	// The max depth of chains
	this.MaxChains    = 0;
	// The max number of sync Calls if one decision statement.
	this.MaxSyncCalls      = 0;

	this.report = function()
	{
		let printer = colors.green;
		if(isFailed(this))
			printer = colors.red;

		console.log(
		   (printer(
		   	`{0}(): {1}-{2}
		   	============
		   	SimpleCyclomaticComplexity: {3}\t
			MaxChains: {4}\t
			MaxSyncCalls: {5}\t
			Parameters: {6}\t 
			Long Method(>120 line): {7}\t
			Big-O: {8}\n\n`
			))
			.format(this.FunctionName, this.StartLine, this.EndLine,
				     this.SimpleCyclomaticComplexity, this.MaxChains,
			        this.MaxSyncCalls, this.ParameterCount, this.EndLine-this.StartLine>120, this.bigo)
		);
	}
};

// A builder for storing file level information.
function FileBuilder()
{
	this.FileName = "";
	// Number of strings in a file.
	this.Strings = 0;
	// Number of imports in a file.
	this.ImportCount = 0;

	this.report = function()
	{
		console.log (
			( "{0}\n" +
			  "~~~~~~~~~~~~\n"+
			  "ImportCount {1}\t" +
			  "Strings {2}\n"
			).format( this.FileName, this.ImportCount, this.Strings ));
	}
}


function traverse(object, visitor)
{
    var key, child;

    visitor.call(null, object);

    for (key in object) {
        if (object.hasOwnProperty(key)) {
            child = object[key];
            if (typeof child === 'object' && child !== null && key != 'parent') 
            {
            	child.parent = object;
					traverse(child, visitor);
            }
        }
    }
}

function complexity(filePath)
{
	var buf = fs.readFileSync(filePath, "utf8");
	var ast = esprima.parse(buf, options);

	var i = 0;

	// A file level-builder:
	var fileBuilder = new FileBuilder();
	fileBuilder.FileName = filePath;
	fileBuilder.ImportCount = 0;
	builders[filePath] = fileBuilder;

	// Tranverse program with a function visitor.
	traverse(ast, function (node) 
	{
		if(node.type === 'CallExpression'){
			if(node.callee.name === 'require')
				fileBuilder.ImportCount++;
		}
		
		if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') 
		{
			var builder = new FunctionBuilder();

			builder.FunctionName = functionName(node);
			builder.StartLine    = node.loc.start.line;
			builder.EndLine = node.loc.end.line;
			builder.ParameterCount = node.params.length;
			builder.MaxSyncCalls = 0;
                        var cond_count=0;
                        
			traverse(node, function(child){
                            
				if(isDecision(child)){
					builder.SimpleCyclomaticComplexity += 1;
				}
                                //chains(child,0,builder);
			
				
				if(child.type==='CallExpression'){
					  if(child.callee.property){
					     if(child.callee.property.name.indexOf("Sync")>-1){
						    builder.MaxSyncCalls += 1;
						}
					    }
					}

				if(child.type==='CallExpression')
				{
					///console.log(child.callee.type);
				}
			
				
			})
              
			//builder.MaxChains = cond_count;
			BigO(node, 0, builder);
			builders[builder.FunctionName] = builder;
		}

	});

}


function BigO(node, depth, res)
{
	var childCount = 0;
	for(let key of Object.keys(node)){
		if(key != 'parent'){
			var child = node[key];
			if(typeof child == 'object' && child != null){
				childCount++;
				if( child.type == 'ForStatement' || child.type == 'WhileStatement' ||
		 child.type == 'ForInStatement' || child.type == 'DoWhileStatement'){
					BigO(child, depth+1, res);	
				} else{
					BigO(child, depth, res);
				}
			}
		}
	}
	
	if(childCount == 0 && res.bigo < depth){
		res.bigo = depth;
	}
}


function functionName( node )
{
	if( node.id )
	{
		return node.id.name;
	}
	return "Anoynymous @" + node.loc.start.line;
}


function isDecision(node)
{
	if( node.type == 'IfStatement' || node.type == 'ForStatement' || node.type == 'WhileStatement' ||
		 node.type == 'ForInStatement' || node.type == 'DoWhileStatement')
	{
		return true;
	}
	return false;
}

function isFailed(builder){
	if(builder.MaxChains > 4 || builder.MaxSyncCalls > 1 ||
		builder.EndLine-builder.StartLine > 120 ||
		builder.bigo > 3) {
			return true;
		}
	return false;
}


if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}


function chains(node, depth, res)
{
	var childCount = 0;
	for(let key of Object.keys(node)){
		if(key != 'parent'){
			var child = node[key];
			if(typeof child == 'Object' && child != null){
				childCount++;
					chains(child, depth+1, res);	
			}
		}
	}
	//console.log("depth is "+ depth);
	if(childCount == 0 && res.MaxChains < depth){
		res.MaxChains = depth;
	}
}

main();
