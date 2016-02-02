# Metastock-Custom-Lists
Convert Symbols from  NASDAQ, NYSE and AMEX into custom lists which can then be imported into metastock. 
The lists can be created based on various criteria for example, all symbols by industries.

## What is Metastock?
It is by far the best platform for technical analysis in Stock Market. [Find more about MetaStock](http://www.metastock.com)

## The problem
Metastock 14 uses Reuters DataLink to download symbol data, which means third party data providers can no longer be used with Metastock 14.  These third party providers used to give away custom lists based on different criteria, for example all symbols by sectors or industries or market cap. Unfortunately, Reuters doesn't do that and you are left alone to figure out all the Gold Mining industries from a list of over 7000 symbols.

Moreover, you cannot even download a list of symbols from online sources because Reuters has its own crazy way of naming tickers. For example, AAPL is AAPL.O or PST^A will be PST_pa.N Weird right!! 

The only is to go through the painful process of adding stock symbols in custom lists by hand!

## Solution
Use metastock-ric! This utility creates lists readable by metastock based on any criteria that you specify. All it needs is a .csv file full of symbols and thats it.

## Installation

Install node js from [here](http://nodejs.org)

`npm install -g metastock-ric`

## How to use it?
Lets say you want to group all symbols based on industries in AMEX, NASDAQ and NYSE. [Go to NASDAQ link and download .csv files](http://www.nasdaq.com/screening/company-list.aspx). You can use any file, this is just an example. Lets say the download directory is "downloads/nasdaq.csv". Next follow these steps.

1. Create a **config.json** file with the following configuration
		<pre>[
			  {
			    "path": "downloads/amex.csv",
			    "exchange": "amex"
			  },
			  {
			    "path": "downloads/nasdaq.csv",
			    "exchange": "nasdaq"
			  },
			  {
			    "path": "downloads/nasdaq.csv",
			    "exchange": "nyse"
			  }
		]</pre>

	All it contains is a list of paths to the cvs files you downloaded. You can look at the included config.json file .

2. Run the command 

	`ric -i <path-to-config.json-file> -o <path-to-output-folder> -f <filtername>`

	Here < filter name > is any field in .csv file on which you want to create custom lists.
3. This will create **symbol-lists** directory with bunch of .xml files along with a **masterlist.xml** .
4. Make a backup of
	`C:\Users\YourUserName\AppData\Local\Thomson Reuters\MetaStock\14.0\CustomLists\`  

5. Copy the contents of symbol-lists directory under 
	`C:\Users\YourUserName\AppData\Local\Thomson Reuters\MetaStock\14.0\CustomLists\`  
6. Copy the contents of **masterlist.xml** and paste it in 
	`C:\Users\YourUserName\AppData\Local\Thomson Reuters\MetaStock\14.0\CustomLists\ListMaster.xml` 
	
	after the last 
	`<MasterFileEntry................. />`
	entry.

7. Save and exit. Restart Metastock and you should see all your custom lists in Power Console.

----------

![enter image description here](http://i.imgur.com/yIAcP7b.png)

----------

## The MIT License
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
