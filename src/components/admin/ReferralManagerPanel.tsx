import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { ReferralManager, ReferralLink, Lecture } from '@/data/mockData';
import { generateReferralLink } from '@/utils/referralUtils';
import { Search, Users, Link as LinkIcon, Plus } from 'lucide-react';

interface ReferralManagerPanelProps {
  referralManagers: ReferralManager[];
  referralLinks: ReferralLink[];
  lectures: Lecture[];
  onAddReferralManager: (rm: Omit<ReferralManager, 'rmId' | 'created_at'>) => void;
  onAddReferralLink: (link: Omit<ReferralLink, 'created_at'>) => void;
}

export default function ReferralManagerPanel({
  referralManagers,
  referralLinks,
  lectures,
  onAddReferralManager,
  onAddReferralLink,
}: ReferralManagerPanelProps) {
  const [activeTab, setActiveTab] = useState('managers');
  const [newRmName, setNewRmName] = useState('');
  const [newRmEmail, setNewRmEmail] = useState('');
  const [selectedRm, setSelectedRm] = useState<string>('');
  const [selectedLecture, setSelectedLecture] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter lectures based on search query
  const filteredLectures = useMemo(() => {
    if (!searchQuery) return lectures;
    return lectures.filter(lecture => 
      lecture.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [lectures, searchQuery]);

  // Group referral links by manager
  const groupedLinks = useMemo(() => {
    return referralLinks.reduce((acc, link) => {
      const rm = referralManagers.find(r => r.rmId === link.rmId);
      if (!rm) return acc;
      
      if (!acc[rm.rmId]) {
        acc[rm.rmId] = {
          manager: rm,
          links: []
        };
      }
      
      const lecture = lectures.find(l => l.id === link.lectureId);
      if (lecture) {
        acc[rm.rmId].links.push({
          ...link,
          lecture
        });
      }
      
      return acc;
    }, {} as Record<string, { manager: ReferralManager; links: (ReferralLink & { lecture: Lecture })[] }>);
  }, [referralLinks, referralManagers, lectures]);

  const handleAddReferralManager = () => {
    if (!newRmName || !newRmEmail) {
      toast.error('Please fill in all fields');
      return;
    }

    onAddReferralManager({
      name: newRmName,
      email: newRmEmail,
    });

    setNewRmName('');
    setNewRmEmail('');
    toast.success('Referral Manager added successfully');
  };

  const handleGenerateLink = () => {
    if (!selectedRm || !selectedLecture) {
      toast.error('Please select both Referral Manager and Lecture');
      return;
    }

    const referralCode = `${selectedRm}-${selectedLecture}`;
    onAddReferralLink({
      referralCode,
      rmId: selectedRm,
      lectureId: selectedLecture,
    });

    const link = generateReferralLink(selectedRm, selectedLecture);
    toast.success('Referral link generated successfully');
    
    // Copy to clipboard
    navigator.clipboard.writeText(link);
    toast.info('Link copied to clipboard');
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6 w-full md:w-auto">
          <TabsTrigger value="managers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Managers</span>
          </TabsTrigger>
          <TabsTrigger value="generate" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Generate Link</span>
          </TabsTrigger>
          <TabsTrigger value="links" className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            <span>All Links</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="managers">
          <Card>
            <CardHeader>
              <CardTitle>Referral Managers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newRmName}
                    onChange={(e) => setNewRmName(e.target.value)}
                    placeholder="Enter name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newRmEmail}
                    onChange={(e) => setNewRmEmail(e.target.value)}
                    placeholder="Enter email"
                  />
                </div>
                <Button onClick={handleAddReferralManager}>Add Referral Manager</Button>

                <div className="mt-6 space-y-4">
                  {referralManagers.map((rm) => (
                    <Card key={rm.rmId}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{rm.name}</h3>
                            <p className="text-sm text-muted-foreground">{rm.email}</p>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {referralLinks.filter(link => link.rmId === rm.rmId).length} links
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generate">
          <Card>
            <CardHeader>
              <CardTitle>Generate Referral Link</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Referral Manager</Label>
                  <Select value={selectedRm} onValueChange={setSelectedRm}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Referral Manager" />
                    </SelectTrigger>
                    <SelectContent>
                      {referralManagers.map((rm) => (
                        <SelectItem key={rm.rmId} value={rm.rmId}>
                          {rm.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Search Lectures</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search lectures..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Select value={selectedLecture} onValueChange={setSelectedLecture}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Lecture" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredLectures.map((lecture) => (
                        <SelectItem key={lecture.id} value={lecture.id}>
                          {lecture.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleGenerateLink}>Generate Link</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="links">
          <Card>
            <CardHeader>
              <CardTitle>All Referral Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(groupedLinks).map(([rmId, { manager, links }]) => (
                  <div key={rmId} className="space-y-4">
                    <h3 className="font-medium">{manager.name}</h3>
                    <div className="space-y-2">
                      {links.map((link) => (
                        <Card key={link.referralCode}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{link.lecture.title}</p>
                                <p className="text-sm text-muted-foreground">
                                  Created: {new Date(link.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  navigator.clipboard.writeText(generateReferralLink(link.rmId, link.lectureId));
                                  toast.success('Link copied to clipboard');
                                }}
                              >
                                Copy Link
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 