
import { useState } from "react";
import { TeamTableView } from "@/components/team/TeamTableView";
import { TeamGridView } from "@/components/team/TeamGridView";
import TeamOrgChart from "@/components/team/TeamOrgChart";
import { TeamHierarchyView } from "@/components/team/TeamHierarchyView";
import { TeamSearch } from "@/components/team/TeamSearch";
import { TeamViewTabs } from "@/components/team/TeamViewTabs";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useTeamManagement } from "@/hooks/useTeamManagement";

const TeamManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState("hierarchy");
  
  const {
    members,
    departments,
    loading,
    handleDeleteMember,
    handleUpdateMember,
    handleAddDepartment,
    handleEditDepartment,
    handleDeleteDepartment,
    handleMoveMember,
    filterMembers
  } = useTeamManagement();

  const filteredMembers = filterMembers(searchQuery);

  // Handlers for TeamOrgChart that match the expected signatures
  const handleAddMemberToDepartment = (departmentId: string) => {
    console.log(`Adding member to department: ${departmentId}`);
    // This would typically open a dialog to add a member to the specific department
  };

  const handleEditMemberById = (memberId: string) => {
    console.log(`Editing member: ${memberId}`);
    // This would typically open a dialog to edit the specific member
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-4"></div>
          <div className="h-12 bg-muted rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <TeamSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      <Tabs value={activeView} onValueChange={setActiveView}>
        <TeamViewTabs
          activeView={activeView}
          onViewChange={setActiveView}
        />

        <TabsContent value="grid">
          <TeamGridView 
            members={filteredMembers}
            onUpdateMember={handleUpdateMember}
          />
        </TabsContent>

        <TabsContent value="table">
          <TeamTableView 
            members={filteredMembers}
            onDeleteMember={handleDeleteMember}
          />
        </TabsContent>

        <TabsContent value="org" className="mt-4">
          <TeamOrgChart
            departments={departments}
            onAddDepartment={handleAddDepartment}
            onEditDepartment={handleEditDepartment}
            onDeleteDepartment={handleDeleteDepartment}
            onAddMember={handleAddMemberToDepartment}
            onEditMember={handleEditMemberById}
            onDeleteMember={handleDeleteMember}
          />
        </TabsContent>

        <TabsContent value="hierarchy" className="mt-4">
          <TeamHierarchyView companyId="mock-company-id" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamManagement;
