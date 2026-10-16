/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  loadStoredState,
  saveState,
  AppState,
  INITIAL_MEMBERS,
  INITIAL_PROJECTS,
  INITIAL_SECTIONS,
  INITIAL_SETTINGS,
  INITIAL_LEADERBOARD,
} from './lib/store';
import { soundFX } from './lib/audio';
import { ProjectItem, LeaderboardEntry } from './types';
import { TopBar } from './components/navigation/TopBar';
import { HeroSection } from './components/hero/HeroSection';
import { MemberSelector } from './components/team/MemberSelector';
import { MemberProfile } from './components/team/MemberProfile';
import { MissionSpherex } from './components/mission/MissionSpherex';
import { ProjectsSection, ProjectDetailModal } from './components/projects/ProjectsSection';
import { LeaderboardSection } from './components/game/LeaderboardSection';
import { CarGameModal } from './components/game/CarGameModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Footer } from './components/layout/Footer';

export default function App() {
  const [appState, setAppState] = useState<AppState>(() => loadStoredState());
  const [selectedMemberSlug, setSelectedMemberSlug] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Sync state changes with localStorage
  useEffect(() => {
    saveState(appState);
  }, [appState]);

  // Command palette shortcut (Cmd+K / Ctrl+K) to open Admin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    soundFX.setMuted(!nextVal);
  };

  const handleNextFromHero = () => {
    const teamSection = document.getElementById('team');
    if (teamSection) {
      teamSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNewLeaderboardScore = (entry: LeaderboardEntry) => {
    const nextList = [entry, ...appState.leaderboard].sort((a, b) => b.score - a.score);
    setAppState((prev) => ({
      ...prev,
      leaderboard: nextList,
    }));
  };

  const handleRestoreDefaults = () => {
    setAppState({
      members: INITIAL_MEMBERS,
      projects: INITIAL_PROJECTS,
      sections: INITIAL_SECTIONS,
      settings: INITIAL_SETTINGS,
      leaderboard: INITIAL_LEADERBOARD,
      media: [],
    });
  };

  const activeMember = appState.members.find((m) => m.slug === selectedMemberSlug);

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Bar Navigation */}
      <TopBar
        teamName={appState.settings.teamName}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenGame={() => setIsGameOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Main Experience Flow */}
      <main className="flex-1 flex flex-col">
        {/* 1. HERO WITH 3D EARTH & EGYPT HEARTBEAT */}
        <HeroSection
          settings={appState.settings}
          onNext={handleNextFromHero}
          onEgyptFocused={() => {}}
        />

        {/* 2. CORE TEAM (NOUR ELDEIN & ABDELRAHMAN FODA) */}
        <MemberSelector
          members={appState.members}
          onSelectMember={(slug) => setSelectedMemberSlug(slug)}
          selectedMemberSlug={selectedMemberSlug}
        />

        {/* 3. SCIENTIFIC MISSION (SPHEREx & PLANET X) */}
        <MissionSpherex
          challengeTitle={appState.settings.challengeTitle}
          challengeTrack={appState.settings.challengeTrack}
        />

        {/* 4. REAL VERIFIED PROJECTS REPOSITORY */}
        <ProjectsSection
          projects={appState.projects}
          onOpenProjectModal={(proj) => setSelectedProject(proj)}
        />

        {/* 5. 3D CAR GAME LAB REVEAL & REAL LEADERBOARD */}
        <LeaderboardSection
          entries={appState.leaderboard}
          onOpenGame={() => setIsGameOpen(true)}
          teamLogoText={appState.settings.gameCarDecalText}
        />
      </main>

      {/* Footer */}
      <Footer
        footerText={appState.settings.footerText}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenGame={() => setIsGameOpen(true)}
      />

      {/* MODAL 1: AUTHENTIC TECHNICAL PROFILE */}
      {activeMember && (
        <MemberProfile
          member={activeMember}
          allProjects={appState.projects}
          onClose={() => setSelectedMemberSlug(null)}
          onOpenProjectModal={(proj) => setSelectedProject(proj)}
        />
      )}

      {/* MODAL 2: PROJECT DETAIL ARCHITECTURE SPEC */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* MODAL 3: 3D CYBER CAR RACER MINI GAME */}
      <CarGameModal
        isOpen={isGameOpen}
        onClose={() => setIsGameOpen(false)}
        teamLogoText={appState.settings.gameCarDecalText}
        carColorHex={appState.settings.gameCarColor}
        highScore={appState.leaderboard[0]?.score || 0}
        onNewScore={handleNewLeaderboardScore}
      />

      {/* MODAL 4: ADMIN DASHBOARD CMS WITH SECURE SERVER AUTH */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        members={appState.members}
        onUpdateMembers={(members) => setAppState((prev) => ({ ...prev, members }))}
        projects={appState.projects}
        onUpdateProjects={(projects) => setAppState((prev) => ({ ...prev, projects }))}
        sections={appState.sections}
        onUpdateSections={(sections) => setAppState((prev) => ({ ...prev, sections }))}
        settings={appState.settings}
        onUpdateSettings={(settings) => setAppState((prev) => ({ ...prev, settings }))}
        media={appState.media}
        onUpdateMedia={(media) => setAppState((prev) => ({ ...prev, media }))}
        leaderboard={appState.leaderboard}
        onResetLeaderboard={() => setAppState((prev) => ({ ...prev, leaderboard: [] }))}
        onRestoreDefaults={handleRestoreDefaults}
      />
    </div>
  );
}
