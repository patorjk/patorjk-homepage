import './App.css'
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableRow,} from "@/components/ui/table"
import {SimpleLink} from "./components/SimpleLink";
import YoutubeIcon from './assets/youtube-nes-icon.png';
import GithubIcon from './assets/github-nes-icon.png';
import InstagramIcon from './assets/instagram-nes-icon.png';
import GmailIcon from './assets/gmail-nes-icon.png';
import type {ContentItem} from "@/components/types.ts";
import {ContentTable} from "@/components/ContentTable.tsx";
import {LightsOut} from "react-halloween";
import {useEffect, useState} from "react";
import {ThemeProvider} from "@/components/theme/ThemeProvider";

const patorjkAsciiArt = `
              __                 __ __    
___________ _/  |_  ___________ |__|  | __
\\____ \\__  \\\\   __\\/  _ \\_  __ \\|  |  |/ /
|  |_> > __ \\|  | (  <_> )  | \\/|  |    < 
|   __(____  /__|  \\____/|__/\\__|  |__|_ \\
|__|       \\/               \\______|    \\/
`;

interface WindowSize {
  width: number;
  height: number;
}

function App() {

  const contentItems: ContentItem[] = [
    {
      title: "Arial ASCII Art Gallery",
      description: "A collection of ASCII Art from the AOL community of the late 90's. The aim of this gallery is to preserve and showcase the cool art from this period.",
      link: "//patorjk.com/arial-ascii-art/",
    },
    {
      title: 'Chain Letter Archive',
      description:
        <span>Chain letters were the Internet's first form of viral media. They were a precursor to today's memes and social media posts. Some of the jokes haven't aged well, but these are an interesting part of the internet's history.</span>,
      link: '//patorjk.com/misc/chainletters/'
    },
    {
      title: "Color Palette Generator",
      description: "Creates a color palette from an image. I made it one afternoon on a lark a long time ago.",
      link: "//www.patorjk.com/color-palette-generator/"
    },
    {
      title: "Gradient Image Generator",
      description: "For creating gradient images (an image that fades from one color to another). A very old app and there aren't many good reasons use it. But it's here just in case.",
      link: "//patorjk.com/gradient-image-generator/"
    },
    {
      title: "Keyboard Layout Analyzer",
      description: "The default layout of the keys on your keyboard is not very good. There are actually several popular layouts you can set yourself up with. This app analyzes the text you type and lets you see what layout would benefit you most.",
      link: "//patorjk.com/keyboard-layout-analyzer/"
    },
    {
      title: "My Blog",
      description: "I like to write. Before I found programming and photography I wanted to be a writer. This blog is mostly me just talking into the void, usually about this site.",
      link: "//patorjk.com/blog/"
    },
    {
      title: "My Photography",
      description: <span>I like to take pictures. This is a collection of my best photography. Technically this is patrickgillespie.com, but no one would find that domain without the links from this site.</span>,
      link: "//patrickgillespie.com/"
    },
    {
      title: "Old School Gaming Filters",
      description: <>Takes a photo and converts it into what it may have looked like on an old school gaming
        console. Uses <SimpleLink
          href={"//patorjk.com/blog/2017/06/02/using-dithering-to-create-old-school-gaming-filters/"}
          label={"dithering"}/> to create the effect.</>,
      link: "//patorjk.com/old-school-gaming-filters/"
    },
    {
      title: 'Text Color Fader', description: <span>
        Create <span style={{color: '#ff0000'}}>c</span><span style={{color: '#ee0011'}}>o</span><span
        style={{color: '#dd0022'}}>l</span><span style={{color: '#cc0033'}}>o</span><span
        style={{color: '#bb0044'}}>r</span><span style={{color: '#aa0055'}}> </span><span
        style={{color: '#990066'}}>f</span><span style={{color: '#880077'}}>a</span><span
        style={{color: '#770088'}}>d</span><span style={{color: '#660099'}}>e</span><span
        style={{color: '#5500aa'}}>d</span><span style={{color: '#4400bb'}}> </span><span
        style={{color: '#3300cc'}}>t</span><span style={{color: '#2200dd'}}>e</span><span
        style={{color: '#1100ee'}}>x</span><span style={{color: '#0000ff'}}>t</span> for your HTML documents, emails, profiles, message board posts, and whatever else you can think of.
      </span>, link: '//patorjk.com/text-color-fader/'
    },
    {
      title: 'Text to ASCII Art Generator', description: <div>
        <span>Create text art from words. Like this:</span>
        <div className="font-mono whitespace-pre text-xs">
          {patorjkAsciiArt}
        </div>
      </div>, link: '//patorjk.com/software/taag/'
    },
    {
      title: 'Typing Speed Test',
      description: 'How fast kind you type? This app is kind of old, but still serves its purposes and it gives you some nice stats and has some handy options.',
      link: '//patorjk.com/typing-speed-test/'
    },
    {
      title: 'Scrolling Text Time Waster',
      description: 'Colors, scrolling, fun?',
      link: '//patorjk.com/misc/scrollingtext/timewaster.php'
    },
    {
      title: 'Snake Game',
      description: 'JavaScript Snake game. The classic game of snake done in JS. Very old game.',
      link: '//patorjk.com/games/snake/'
    },
    {
      title: 'Subpixel Snake Game',
      description: <span>A game of snake that's so small that you need a microscope to play it! I did a <SimpleLink
        label={'video'} href={"https://www.youtube.com/watch?v=iDwganLjpW0"}/> explaining the game if you're curious about it.</span>,
      link: '//patorjk.com/games/subpixel-snake/'
    },
    {
      title: 'Slider Puzzles',
      description: 'An assortment of various slider puzzles with a neat spinning interface.',
      link: '//patorjk.com/games/sliderpuzzles/'
    },
    {
      title: '90\'s Photo Mosaics',
      description:
        <span>I made these with an app I wrote in high school. In 2025 I remade the app, you can check it out <SimpleLink
          href={'https://github.com/patorjk/mosaicer'} label={'here'}/>.</span>,
      link: '//patorjk.com/software/mosaicer/mosaics.htm'
    },
  ];

  const blogItems: ContentItem[] = [
    {
      title: 'Cracking MaGuS’s Fate Zero Encryption',
      description: 'I cracked the encryption of Fate Zero, an infamous prog by MaGuS, and wound up unmasking the hacker behind the app.',
      link: '//patorjk.com/blog/2012/05/03/cracking-magus-fate-zero-encryption/'
    },
    {
      title: 'Pronouncing SQL: S-Q-L or Sequel?',
      description: 'Don\'t lie, you don\'t know how to pronounce it either. I got to the bottom of it by emailing the original author of SQL.',
      link: '//patorjk.com/blog/2012/01/26/pronouncing-sql-s-q-l-or-sequel/'
    },
    {
      title: 'Three Things to Say',
      description: 'Mostly just some boring site updates, but my last thing to say was a goodbye to one of the great sites of the AOL prog era, DarcFX. A lot of people chimed in in comments, there\'s some drama about stuff I dont\'t remember much about, and then it turns out DarkFX isn\'t actually gone.',
      link: '//patorjk.com/blog/2008/01/06/three-things-to-say/'
    },
    {
      title: 'Extendible BBCode Parser in JavaScript',
      description: 'Entry on a BBCode parser I wrote. It got a surprising amount of feedback.',
      link: '//patorjk.com/blog/2011/05/07/extendible-bbcode-parser-in-javascript/'
    },
    {
      title: 'Was Mark Zuckerberg an AOL add-on developer?',
      description: <span>I did a <SimpleLink href={'https://www.youtube.com/watch?v=7Uly3hbtzKQ'} label={'video'}/> on this topic too, but it turns out Zuck cut his teeth in the AOL dev community.</span>,
      link: '//patorjk.com/blog/2013/04/09/was-mark-zuckerberg-an-aol-add-on-developer/'
    },
    {
      title: 'TheDraw’s Lost ANSI Art Fonts',
      description: 'A look at some lost ANSI art from the legendary DOS app, TheDraw.',
      link: '//patorjk.com/blog/2014/01/22/thedraws-lost-ansi-art-fonts/'
    },
  ];

  const legacyItems: ContentItem[] = [
    {
      title: 'Visual Basic Arrays Tutorial by Adam Wehmann',
      description: 'An array tutorial that covers the basics of arrays and how you use them in VB.',
      link: '//patorjk.com/programming/tutorials/vbarrays.htm'
    },
    {
      title: 'Visual Basic 6.0 Code Bank',
      description: 'A large collection of popular code samples written in Visual Basic 5.0 and 6.0.',
      link: '//patorjk.com/programming/tutorials/vb6codebank.htm'
    },
    {
      title: 'Visual Basic 6.0 Example Archive',
      description: 'A collection of Visual Basic code that was submitted to patorjk.com between the years of 1998 and 2003. Examples cover everything from AOL add-on programming to working with files to image manipulation to menu customization to the Windows API and much more.',
      link: '//patorjk.com/programming/vb6examples.htm'
    },
    {
      title: 'PAT or JK’s API Spy 5.1',
      description: 'Generates the VB code to find and manipulate windows. This was the last version.',
      link: '//patorjk.com/downloads/patorjkapispy51.zip'
    },
  ];

  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <ThemeProvider defaultTheme="system" storageKey="homepage-theme">
      <div
        className={'flex flex-col gap-8 justify-center items-center relative p-10 max-w-xl md:max-w-4xl justify-self-center'}>
        {windowSize.width > 600 && <LightsOut size={300}/>}
        <div className={'flex flex-col  gap-2'}>
          <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
            patorjk.com
          </h1>
          <p className={"text-muted-foreground text-[1.05rem] sm:text-base"}>
            Welcome! My name is Pat. I am software software developer and amateur photographer. Here's you'll find an
            array of web apps, programming
            tutorials, and random
            projects.
          </p>
        </div>

        <div className={'w-full'}>
          <Card className="w-full gap-2">
            <CardHeader>
              <CardTitle>Web apps, games, and other interesting things</CardTitle>
              <CardDescription>
                Below is selection of stuff from this website. There's a lot more content buried in my <SimpleLink
                href={"//patorjk.com/blog"}
                label={'blog'}/>, but the list below is a nice showcase.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContentTable items={contentItems}/>
            </CardContent>
          </Card>
        </div>

        <div className={'w-full'}>
          <Card className="w-full gap-2">
            <CardHeader>
              <CardTitle>Notable blog entries</CardTitle>
              <CardDescription className="flex flex-col gap-2">
                <p>
                  I have a <SimpleLink href={"//patorjk.com/blog"} label={'blog'}/> where I write stuff. I've written
                  hundreds of entries, and
                  most have no comments. I don't even know if anyone regularly reads it. However, occasionally I write
                  something
                  that piques people's interest and gets a discussion going. Below are the most popular entries.
                </p>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContentTable items={blogItems}/>
            </CardContent>
          </Card>
        </div>

        <div className={'w-full'}>
          <Card className="w-full gap-2">
            <CardHeader>
              <CardTitle>Legacy content - Visual Basic 6.0</CardTitle>
              <CardDescription className="flex flex-col gap-2">
                <p>
                  This site started out as a Visual Basic (VB) help web site in 1998. When I relaunched this site in
                  2007,
                  I debated removing this stuff. I hadn't been a member of the VB community in years and the language
                  seemed
                  like it was
                  on its way out. But it felt wrong to remove the material that had built this site, so I decided to
                  keep it up for nostalgic reasons.
                </p>
                <p>In the years that followed I
                  noticed
                  that this content was still wildly popular. In fact, for a while the Visual Basic
                  Arrays tutorial was the most popular piece of content on this site. I would even get an occasional
                  email
                  about needing help with Visual Basic. It was strange.
                </p>
                <p>
                  Then I discovered that Visual Basic was being taught in introductory level programming classes in some
                  countries and students were finding their way to my site for help. It boggled my mind that a cache
                  of programming examples created by AOL hackers was now being used as study material for students all
                  around the world. So I decided to keep these examples up indefinitely.
                </p>
                <p>
                  I will say that at this point it's been a very long time since anyone seriously asked me for VB help,
                  and
                  these example are probably not useful anymore. But you never know who this content may help out, and
                  at the very least it's interesting for taking a look back into the past.
                </p>

              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContentTable items={legacyItems}/>
            </CardContent>
          </Card>
        </div>

        <div className={'w-full'}>
          <Card className="w-full gap-2">
            <CardHeader>
              <CardTitle>Pat's Social Media</CardTitle>
              <CardDescription className="flex flex-col gap-2">
                <p>
                  Below are some social links.
                </p>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>

                  <TableRow>
                    {/* Social icons taken from https://github.com/nostalgic-css/NES.css */}
                    <TableCell
                      className="font-medium whitespace-normal flex flex-row gap-4 items-center justify-center flex-wrap">
                      <a title={'My YouTube Channel'} href={"https://www.youtube.com/@patorjk"}><img src={YoutubeIcon}
                                                                                                     width={64}
                                                                                                     height={64}/></a>
                      <a title={'My Github Profile'} href={"https://github.com/patorjk"}><img src={GithubIcon}
                                                                                              width={64}
                                                                                              height={64}/></a>
                      <a title={'My Instagram Page'} href={"https://instagram.com/patorjk"}><img src={InstagramIcon}
                                                                                                 width={64}
                                                                                                 height={64}/></a>
                      <a title={'Email Me'} href={"mailto:patorjk@gmail.com"}><img src={GmailIcon} width={64}
                                                                                   height={64}/></a>

                    </TableCell>
                  </TableRow>

                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App
