import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, AlertCircle, Info } from "lucide-react"

export default function DeploymentPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Deployment Guide</h1>
        <p className="text-muted-foreground">Follow these steps to deploy your CleanPro Manager application.</p>
      </div>

      <Tabs defaultValue="vercel">
        <TabsList>
          <TabsTrigger value="vercel">Vercel</TabsTrigger>
          <TabsTrigger value="netlify">Netlify</TabsTrigger>
          <TabsTrigger value="aws">AWS</TabsTrigger>
        </TabsList>

        <TabsContent value="vercel" className="space-y-4 mt-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Recommended Deployment</AlertTitle>
            <AlertDescription>Vercel is the recommended platform for deploying Next.js applications.</AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Deploy to Vercel</CardTitle>
              <CardDescription>Follow these steps to deploy your application to Vercel.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Step 1: Prepare Your Repository</h3>
                <p className="text-sm text-muted-foreground">
                  Make sure your project is in a Git repository (GitHub, GitLab, or Bitbucket).
                </p>
                <div className="bg-muted p-3 rounded-md text-sm font-mono">
                  git init
                  <br />
                  git add .<br />
                  git commit -m "Initial commit"
                  <br />
                  git remote add origin your-repository-url
                  <br />
                  git push -u origin main
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Step 2: Connect to Vercel</h3>
                <p className="text-sm text-muted-foreground">
                  Sign up or log in to Vercel and connect your Git repository.
                </p>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>
                    Go to{" "}
                    <a
                      href="https://vercel.com"
                      className="text-blue-500 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      vercel.com
                    </a>{" "}
                    and sign up or log in
                  </li>
                  <li>Click "Add New" and select "Project"</li>
                  <li>Import your Git repository</li>
                  <li>Vercel will automatically detect that it's a Next.js project</li>
                </ol>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Step 3: Configure Environment Variables</h3>
                <p className="text-sm text-muted-foreground">
                  Add any necessary environment variables in the Vercel dashboard.
                </p>
                <div className="bg-muted p-3 rounded-md text-sm">
                  <p>Required environment variables:</p>
                  <ul className="list-disc list-inside mt-2">
                    <li>DATABASE_URL - Your database connection string</li>
                    <li>NEXTAUTH_SECRET - A secret for NextAuth.js</li>
                    <li>NEXTAUTH_URL - Your application URL</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Step 4: Deploy</h3>
                <p className="text-sm text-muted-foreground">
                  Click "Deploy" and Vercel will build and deploy your application.
                </p>
                <div className="flex items-center space-x-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Your application will be deployed to a *.vercel.app domain</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Step 5: Set Up a Custom Domain (Optional)</h3>
                <p className="text-sm text-muted-foreground">Add a custom domain to your Vercel project.</p>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Go to your project settings in Vercel</li>
                  <li>Click on "Domains"</li>
                  <li>Add your custom domain</li>
                  <li>Follow the instructions to configure DNS settings</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="netlify" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Deploy to Netlify</CardTitle>
              <CardDescription>Follow these steps to deploy your application to Netlify.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Detailed Netlify deployment instructions would go here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="aws" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Deploy to AWS</CardTitle>
              <CardDescription>Follow these steps to deploy your application to AWS.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Detailed AWS deployment instructions would go here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important</AlertTitle>
        <AlertDescription>
          Make sure to set up proper authentication and security measures before deploying to production.
        </AlertDescription>
      </Alert>
    </div>
  )
}

