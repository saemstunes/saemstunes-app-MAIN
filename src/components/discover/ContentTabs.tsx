
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Music, User, Mic, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import VideoCardWrapper from "@/components/videos/VideoCardWrapper";
import { mockVideos } from "@/data/mockData";
import ArtistCard from "./ArtistCard";

interface ContentTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const ContentTabs: React.FC<ContentTabsProps> = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  
  const artists = [
    {
      id: "artist-1",
      name: "Kendi Nkonge",
      role: "Performer/Vocalist",
      imageSrc: "https://i.imgur.com/7CFi8hL.jpeg",
      link: "https://open.spotify.com/artist/1eRQ6VZjE5zn8a8cxYEoR7"
    },
    {
      id: "artist-2",
      name: "Jonathan McReynolds",
      role: "Singer/Music Professor", 
      imageSrc: "https://i.imgur.com/HDfxFTF.jpeg",
      link: "https://open.spotify.com/artist/5ItTHwcEtFh6DEOBheMub9"
    },
    {
      id: "artist-3",
      name: "Janice Wanjiru-Kioko",
      role: "Singer/Vocal Coach",
      imageSrc: "https://i.imgur.com/m4RCnEl.jpeg", 
      link: "https://www.instagram.com/janicewanjiru_kioko/?hl=en"
    },
    {
      id: "artist-4",
      name: "Bire the Vocalist",
      role: "Performer/Vocalist",
      imageSrc: "https://i.imgur.com/GiaZkBN.jpeg",
      link: "https://open.spotify.com/artist/19cIDIEhh6ccn5BzxvZi3x"
    },
    {
      id: "artist-5",
      name: "Josh Groban",
      role: "Classical Singer",
      imageSrc: "https://i.imgur.com/zoWPxEW.jpeg",
      link: "https://music.apple.com/artist/6cXMpsP9x0SH4kFfMyVezF"
    },
    {
      id: "artist-6",
      name: "Tori Kelly",
      role: "Performer/Vocalist",
      imageSrc: "https://i.imgur.com/jT7HABQ.jpeg",
      link: "https://open.spotify.com/artist/1vSN1fsvrzpbttOYGsliDr"
    },
    {
      id: "artist-7",
      name: "Lisa-Oduor Noah",
      role: "Performer/Vocalist", 
      imageSrc: "https://i.imgur.com/1jFe8dW.jpeg",
      link: "https://music.apple.com/artist/2lzhfTv334wDq7W7tFyJHa"
    },
    {
      id: "artist-8",
      name: "Cynthia Erivo",
      role: "Performer/Vocalist",
      imageSrc: "https://i.imgur.com/napbSbt.jpeg",
      link: "https://open.spotify.com/artist/46UMQ0cW8ToR8egkBRwAxZ"
    }
  ];
  
  return (
    <Tabs defaultValue="music" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-3">
        <TabsTrigger value="music">
          <Music className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Classes</span>
        </TabsTrigger>
        <TabsTrigger value="artists">
          <User className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Artists</span>
        </TabsTrigger>
        <TabsTrigger value="courses">
          <Mic className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">External Courses</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="music" className="pt-4">
        <h2 className="text-xl font-proxima font-semibold mb-4">Lessons from Around The World</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {mockVideos.slice(0, 8).map(video => (
            <VideoCardWrapper 
              key={video.id} 
              video={video} 
              onClick={() => navigate(`/videos/${video.id}`)}
            />
          ))}
        </div>
        <div className="mt-6 text-center">
          <Button 
            variant="outline" 
            onClick={() => navigate('/videos')}
            className="border-gold text-gold hover:bg-gold/10"
          >
            View All Classes
          </Button>
        </div>
      </TabsContent>
      
      <TabsContent value="artists" className="pt-4">
        <h2 className="text-xl font-proxima font-semibold mb-4">Artists You Should Listen To</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {artists.map((artist, index) => (
            <div key={index} className="group relative">
              <ArtistCard 
                name={artist.name}
                role={artist.role}
                imageSrc={artist.imageSrc}
                onClick={() => navigate(`/artist/${artist.id}`)}
              />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 bg-black/50 hover:bg-black/70"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(artist.link, '_blank', 'noopener,noreferrer');
                  }}
                >
                  <ExternalLink className="h-4 w-4 text-white" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Button 
            variant="outline" 
            onClick={() => navigate('/artists')}
            className="border-gold text-gold hover:bg-gold/10"
          >
            View All Artists
          </Button>
        </div>
      </TabsContent>
      
      <TabsContent value="courses" className="pt-4">
        <h2 className="text-xl font-proxima font-semibold mb-4">External Educational Content</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {mockVideos.filter(v => v.category === "Vocal Development").slice(0, 4).map(video => (
            <VideoCardWrapper 
              key={video.id} 
              video={video} 
              onClick={() => navigate(`/videos/${video.id}`)}
              isPremium
            />
          ))}
        </div>
        <div className="mt-6 text-center">
          <Button 
            variant="outline" 
            onClick={() => navigate('/courses')}
            className="border-gold text-gold hover:bg-gold/10"
          >
            View All Courses
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ContentTabs;
