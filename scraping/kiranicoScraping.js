var request = require('request');
var fs = require('fs');

var wpnNames = ["Greatsword", 
				"Long Sword", 
				"Sword and Shield", 
				"Dualswords", 
				"Hammer", 
				"Hunting Horn", 
				"Lance", 
				"Gunlance", 
				"Switchaxe", 
				"Chargeblade", 
				"Insect Glaive", 
				"Light Bowgun", 
				"Heay Bowgun", 
				"Bow"];
				
var monNames = [];

//1) scrape monNames, save to file
scrapeUrl("https://mhworld.kiranico.com/monster", "./MH_Data/MonsterNames.MON", ["https://mhworld.kiranico.com/monster/.*\""]);
//2) scrape monHitZones based on monNames, save to file
//3) scrape weapons based on wpnNames, save to file

/**
 * request url searches for specified Matches and saves contained data to file
 **/
function scrapeUrl(sUrl, sFile, aStringMatches)
{
	request(sUrl, function (err, response, html)
	{
		if (err && response !== 200)
		{
			console.log("Something happened when scraping " + sUrl);
			console.log(err);
		}
		else
		{
			//console.log(html);
			aEntries = [];
			for(i = 0; i < aStringMatches.length; i++)
			{
				aEntries.push(html.match(new RegExp(aStringMatches[i], "g"))); //TODO: parse Values from html
				var aControlSequeces = aStringMatches[i].split(".*");
				for(j = 0; j < aEntries[i].length; j++)
				{
					for(t = 0; t < aControlSequeces.length; t++)
					{
						//console.log(aEntries[i][j]);
						aEntries[i][j] = aEntries[i][j].replace(aControlSequeces[t], ",");
						//console.log(aEntries[i][j]);
					}
				}
			}
			for(i = 0; i < aEntries[0].length; i++)
			{
				sLine = "";
				for(t = 0; t < aEntries.length; t++)
				{
					sLine = sLine + aEntries[t][i].substr(1);
				}
				sLine = sLine.substr(0, sLine.length-1);
				monNames[i] = sLine;
				genericWriteToFile(sFile, sLine);
			}
			//console.log(aControlSequeces);
			//console.log(aEntries);
			//console.log(monNames);
		}
	});
}

/**
* writes given line to given file
**/
function genericWriteToFile(sFile, sLine)
		{
			fs.appendFile(sFile, sLine + "#\n", function (err)
			{
				if (err)
				{
				return console.log(err);
				}
			});
		}