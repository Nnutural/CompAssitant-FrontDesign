import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/app/components/Layout';
import { Landing } from '@/app/pages/Landing';
import { Home } from '@/app/pages/Home';
import { Opportunities } from '@/app/pages/Opportunities';
import { Recommender } from '@/app/pages/Recommender';
import { IdeaLab } from '@/app/pages/IdeaLab';
import { DocStudio } from '@/app/pages/DocStudio';
import { Planner } from '@/app/pages/Planner';
import { Assets } from '@/app/pages/Assets';
import { Careers } from '@/app/pages/Careers';
import { DataHub } from '@/app/pages/DataHub';
import { Settings } from '@/app/pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/recommender" element={<Recommender />} />
          <Route path="/idea-lab" element={<IdeaLab />} />
          <Route path="/doc-studio" element={<DocStudio />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/data-hub" element={<DataHub />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}