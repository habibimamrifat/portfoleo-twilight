import ProfileInfo from "@/components/common/Profile/ProfileInfo";
import Banner from "@/components/common/Profile/Banner";
import AboutMe from "@/components/common/Profile/aboutMe/AboutMe";
import WorkSector from "@/components/common/Profile/workSector/WorkSector";

export default function ProfilePage() {
  return (
    <div className="min-h-[calc(100vh-3rem)]">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">
          Profile
        </h1>

        <p className="mt-1 text-sm text-white/50">
          Manage your personal and professional information.
        </p>
      </div>

      <div className="space-y-6">
        <ProfileInfo />

        <AboutMe isAdmin/>

        <WorkSector />

        <Banner />
      </div>
    </div>
  );
}