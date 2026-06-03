import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Plus, Edit, Trash2, BookMarked, Eye, Lock, Globe, MoreVertical, ArrowLeft } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { SEO } from "@/components/SEO";

interface ReadingList {
  id: string;
  name: string;
  description: string | null;
  visibility: "private" | "public";
  createdAt: string;
  itemCount?: number;
}

export default function ReadingLists() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [listToDelete, setListToDelete] = useState<ReadingList | null>(null);
  const [selectedList, setSelectedList] = useState<ReadingList | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    visibility: "private" as "private" | "public",
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login?returnTo=/reading-lists");
    }
  }, [authLoading, isAuthenticated, navigate]);

  const { data: lists, isLoading } = useQuery<ReadingList[]>({
    queryKey: ["/api/reading-lists"],
    queryFn: async () => {
      const response = await fetch("/api/reading-lists", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch reading lists");
      return response.json();
    },
    enabled: isAuthenticated,
  });

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a list name",
        variant: "error",
      });
      return;
    }

    try {
      await apiRequest("POST", "/api/reading-lists", formData);
      queryClient.invalidateQueries({ queryKey: ["/api/reading-lists"] });
      setShowCreateDialog(false);
      setFormData({ name: "", description: "", visibility: "private" });
      
      toast({
        title: "List Created",
        description: "Your reading list has been created successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create list",
        variant: "error",
      });
    }
  };

  const handleEdit = async () => {
    if (!selectedList) return;
    
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a list name",
        variant: "error",
      });
      return;
    }

    try {
      await apiRequest("PATCH", `/api/reading-lists/${selectedList.id}`, formData);
      queryClient.invalidateQueries({ queryKey: ["/api/reading-lists"] });
      setShowEditDialog(false);
      setSelectedList(null);
      
      toast({
        title: "List Updated",
        description: "Your reading list has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update list",
        variant: "error",
      });
    }
  };

  const confirmDelete = async () => {
    if (!listToDelete) return;
    try {
      await apiRequest("DELETE", `/api/reading-lists/${listToDelete.id}`);
      queryClient.invalidateQueries({ queryKey: ["/api/reading-lists"] });
      toast({
        title: "List Deleted",
        description: "Your reading list has been deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete list",
        variant: "error",
      });
    } finally {
      setShowDeleteDialog(false);
      setListToDelete(null);
    }
  };

  const handleDelete = (list: ReadingList) => {
    setListToDelete(list);
    setShowDeleteDialog(true);
  };

  const openEditDialog = (list: ReadingList) => {
    setSelectedList(list);
    setFormData({
      name: list.name,
      description: list.description || "",
      visibility: list.visibility,
    });
    setShowEditDialog(true);
  };

  const getVisibilityIcon = (visibility: string) => {
    return visibility === "public" ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BookMarked className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden">
      <SEO
        title="Reading Lists | AmourScans"
        description="Organize your favorite manga and manhwa into custom reading lists. Create, manage, and share collections of series on AmourScans."
        keywords="reading lists, manga collections, manhwa lists, organize manga"
      />
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="w-fit text-muted-foreground hover:text-primary mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Reading Lists</h1>
              <p className="text-muted-foreground">Create custom collections of your favorite series</p>
            </div>
            <Button onClick={() => setShowCreateDialog(true)} className="min-h-11">
              <Plus className="w-4 h-4 mr-2" />
              Create List
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Lists</CardTitle>
                <BookMarked className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-12" />
                ) : (
                  <div className="text-2xl font-bold">{lists?.length || 0}</div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Public Lists</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-12" />
                ) : (
                  <div className="text-2xl font-bold">
                    {lists?.filter(l => l.visibility === "public").length || 0}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-6 w-20" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : lists && lists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lists.map((list) => (
                <Card key={list.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <BookMarked className="w-5 h-5" />
                          {list.name}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {list.description || "No description"}
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" aria-label="List options">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(list)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(list)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant={list.visibility === "public" ? "default" : "secondary"}>
                        {getVisibilityIcon(list.visibility)}
                        <span className="ml-1">{list.visibility}</span>
                      </Badge>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Eye className="w-4 h-4" />
                        {list.itemCount || 0} items
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookMarked className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Reading Lists Yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Create your first reading list to organize your favorite series
                </p>
                <Button onClick={() => setShowCreateDialog(true)} className="min-h-11">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First List
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Create Dialog */}
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogContent className="w-[95vw] max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Reading List</DialogTitle>
                <DialogDescription>
                  Create a custom list to organize your favorite series
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">List Name</Label>
                  <Input
                    id="name"
                    placeholder="My Favorites"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your reading list..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="visibility">Visibility</Label>
                  <Select
                    value={formData.visibility}
                    onValueChange={(value: "private" | "public") => 
                      setFormData({ ...formData, visibility: value })
                    }
                  >
                    <SelectTrigger id="visibility">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          Private - Only you can see this
                        </div>
                      </SelectItem>
                      <SelectItem value="public">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          Public - Everyone can see this
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)} className="min-h-11">
                  Cancel
                </Button>
                <Button onClick={handleCreate} className="min-h-11">Create List</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Dialog */}
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="w-[95vw] max-w-lg">
              <DialogHeader>
                <DialogTitle>Edit Reading List</DialogTitle>
                <DialogDescription>Update your reading list details</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">List Name</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description">Description (Optional)</Label>
                  <Textarea
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-visibility">Visibility</Label>
                  <Select
                    value={formData.visibility}
                    onValueChange={(value: "private" | "public") => 
                      setFormData({ ...formData, visibility: value })
                    }
                  >
                    <SelectTrigger id="edit-visibility">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          Private - Only you can see this
                        </div>
                      </SelectItem>
                      <SelectItem value="public">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          Public - Everyone can see this
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowEditDialog(false)} className="min-h-11">
                  Cancel
                </Button>
                <Button onClick={handleEdit} className="min-h-11">Update List</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete reading list?</AlertDialogTitle>
                <AlertDialogDescription>
                  Delete &ldquo;{listToDelete?.name}&rdquo;? This will permanently remove the list and all its items. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
