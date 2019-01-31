using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace ElvenCompile {
	internal static class Program {
		private const char yes = 'y';
		private const char no = 'n';

		private const string CustomDirectory = "elven-custom";
		private const string EngineDirectory = "elven-engine";
		private const string OutputFileName = "index.html";

		private static readonly string[] GlobalEvalStart = File.ReadAllLines("evalstart.html");
		private static readonly string[] GlobalEvalEnd = File.ReadAllLines("evalend.html");
		private static readonly string[] HtmlHead = File.ReadAllLines("head.html");

		private sealed class SectorEvaluation {
			public List<string> Images {
				get; set;
			}
			public List<string> BackgroundImages {
				get; set;
			}
			public List<string> Music {
				get; set;
			}
			public List<string> Sound {
				get; set;
			}
			public List<string> Script {
				get; set;
			}
		}

		private static string PathRewrite(string path,string firstDirectory) {
			var splitPath = path.Split('\\').ToList();
			int i;
			for(i = 0;i<splitPath.Count;i++) {
				if(splitPath[i] == firstDirectory) {
					break;
				}
			}
			return string.Join('/',splitPath.GetRange(i,splitPath.Count-i));
		}

		private static void Main() {
			bool includeGlobalObjectEvaluation = false;

			while(true) {
                Console.Write($"Do you want global object evaluation ({yes}/{no}): ");
				char keyBuffer = Console.ReadKey().KeyChar;
                Console.WriteLine();
				if(keyBuffer == yes) {
					includeGlobalObjectEvaluation = true;
					break;
				} else if(keyBuffer == no) {
					includeGlobalObjectEvaluation = false;
					break;
				}
			}

			int width = 0;
			while(true) {
                Console.Write("Canvas width: ");
				string lineRead = Console.ReadLine();
				if(int.TryParse(lineRead,out width)) {
					break;
				}
			}

			int height = 0;
			while(true) {
                Console.Write("Canvas height: ");
				string lineRead = Console.ReadLine();
				if(int.TryParse(lineRead,out height)) {
					break;
				}
			}
			WriteIndexFile(width,height,includeGlobalObjectEvaluation);
		}

		private static SectorEvaluation GetSectorEvaluation(string directory) {
            var sectorEvaluation = new SectorEvaluation();
            if(!Directory.Exists(directory)) {
                return sectorEvaluation;
            }
            var soundDirectory = Path.Combine(directory,"audio");
            var musicDirectory = Path.Combine(soundDirectory,"music");
            var imagesDirectory = Path.Combine(directory,"images");
            var backgroundImagesDirectory = Path.Combine(directory,"images","backgrounds");
			sectorEvaluation.Script = Directory.GetFiles(directory,"*.js",SearchOption.AllDirectories).ToList();//.OrderByDescending((x) => x.Length).ToList();

			if(Directory.Exists(soundDirectory)) {
			    sectorEvaluation.Sound = Directory.GetFiles(soundDirectory,"*",SearchOption.TopDirectoryOnly).ToList();
			} else {
                sectorEvaluation.Sound = new List<string>();
            }
            if(Directory.Exists(musicDirectory)) {
			    sectorEvaluation.Music = Directory.GetFiles(musicDirectory,"*",SearchOption.AllDirectories).ToList();
			} else {
                sectorEvaluation.Music = new List<string>();
            }
            if(Directory.Exists(imagesDirectory)) {
			    sectorEvaluation.Images = Directory.GetFiles(imagesDirectory,"*",SearchOption.TopDirectoryOnly).ToList();
			} else {
                sectorEvaluation.Images = new List<string>();
            }
            if(Directory.Exists(backgroundImagesDirectory)) {
			    sectorEvaluation.BackgroundImages = Directory.GetFiles(backgroundImagesDirectory,"*",SearchOption.AllDirectories).ToList();
            } else {
                sectorEvaluation.BackgroundImages = new List<string>();
            }

			return sectorEvaluation;
		}

		private static void ToFront<T>(this List<T> list,int index) {
			T item = list[index];
			for(int i = index;i > 0;i--) {
				list[i] = list[i - 1];
			}
			list[0] = item;
		}

		private static void WriteIndexFile(int width,int height,bool includeGlobalObjectEvaluation) {
			var rootLocation = new List<string>(Environment.CurrentDirectory.Split('\\'));
			rootLocation.RemoveAt(rootLocation.Count-1);
			var rootPath = string.Join('\\',rootLocation);

			var lines = new List<string>(HtmlHead);
			lines.Add("<body>");
			lines.Add($"    <canvas id=\"canvas\" width=\"{width}\" height=\"{height}\"></canvas>");
			lines.Add("    <p id=\"picture-mode-element\"></p>");
			if(includeGlobalObjectEvaluation) {
				lines.AddRange(GlobalEvalStart);
			}

			var customFiles = GetSectorEvaluation(Path.Combine(rootPath,CustomDirectory));
			var engineFiles = GetSectorEvaluation(Path.Combine(rootPath,EngineDirectory));

			for(int i = 0;i<engineFiles.Script.Count;i++) {
				if(engineFiles.Script[i].EndsWith("base.js")) {
					engineFiles.Script.ToFront(i);
					i--;
				}
			}
			for(int i = 0;i<customFiles.Script.Count;i++) {
				if(customFiles.Script[i].EndsWith("base.js")) {
					customFiles.Script.ToFront(i);
					i--;
				}
			}

			foreach(var script in engineFiles.Script) {
                lines.Add($"    <script src=\"{PathRewrite(script,EngineDirectory)}\"></script>");
            }
            foreach(var script in customFiles.Script) {
                lines.Add($"    <script src=\"{PathRewrite(script,CustomDirectory)}\"></script>");
            }

			if(includeGlobalObjectEvaluation) {
				lines.AddRange(GlobalEvalEnd);
			}

			lines.Add("</body>");
			lines.Add("</html>");

			File.WriteAllLines(Path.Combine(rootPath,OutputFileName),lines);
		}
	}
}
