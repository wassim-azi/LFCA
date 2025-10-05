import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faServer,
  faCloud,
  faShield,
  faGears,
  faClipboardList,
} from '@fortawesome/free-solid-svg-icons';
import { faLinux, faGithub } from '@fortawesome/free-brands-svg-icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const categories = [
  {
    id: 'linux',
    name: 'Linux',
    icon: faLinux,
    color: 'text-yellow-600',
  },
  {
    id: 'system',
    name: 'System Administration',
    icon: faServer,
    color: 'text-blue-600',
  },
  {
    id: 'cloud',
    name: 'Cloud Computing',
    icon: faCloud,
    color: 'text-cyan-600',
  },
  {
    id: 'security',
    name: 'Security',
    icon: faShield,
    color: 'text-red-600',
  },
  {
    id: 'devops',
    name: 'DevOps',
    icon: faGears,
    color: 'text-green-600',
  },
  {
    id: 'it',
    name: 'IT Project Management',
    icon: faClipboardList,
    color: 'text-purple-600',
  },
];

const Home = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/quiz?category=${categoryId}`);
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden">
      <header className="border-b border-border bg-card shadow-sm" role="banner">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">LFCA</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Linux Foundation Certified IT Associate (LFCA)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/wassim-azi/LFCA"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open GitHub repository"
              className="rounded p-2 text-muted-foreground hover:bg-accent/50 hover:text-foreground"
            >
              <FontAwesomeIcon icon={faGithub} className="h-5 w-5" />
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto" role="main">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-3xl font-bold text-foreground">Choose a Category</h2>
            <p className="text-muted-foreground">Select a topic to start practicing questions</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Card
                key={category.id}
                className="group cursor-pointer transition-shadow hover:shadow-lg"
                onClick={() => handleCategoryClick(category.id)}
              >
                <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                  <div className={`${category.color} transition-transform group-hover:scale-110`}>
                    <FontAwesomeIcon icon={category.icon} size="4x" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{category.name}</h3>
                  <Button
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCategoryClick(category.id);
                    }}
                  >
                    Start Quiz
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
