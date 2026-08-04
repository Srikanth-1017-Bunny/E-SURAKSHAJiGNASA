import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Layouts
import UserLayout from '../layouts/UserLayout';
import CollectorLayout from '../layouts/CollectorLayout';
import GovernmentLayout from '../layouts/GovernmentLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// UI Components for testing
import Button from '../components/ui/Button';
import Card, { CardTitle, CardContent } from '../components/ui/Card';
import Table, { TableHeader, TableHead, TableBody, TableRow, TableCell } from '../components/ui/Table';

// Lazy Load Pages
const LandingPage = lazy(() => import('../pages/LandingPage'));
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const SignUpPage = lazy(() => import('../pages/auth/SignUpPage'));
const ChangePasswordPage = lazy(() => import('../pages/auth/ChangePasswordPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));
const UnauthorizedPage = lazy(() => import('../pages/UnauthorizedPage'));
const RoleSwitcher = lazy(() => import('../pages/RoleSwitcher'));
const RecyclingGuide = lazy(() => import('../pages/RecyclingGuide'));
const IndustryPage = lazy(() => import('../pages/IndustryPage'));

// User Pages
const UserDashboard = lazy(() => import('../pages/user/UserDashboard'));

const RewardDetailPage = lazy(() => import('../pages/user/RewardDetailPage'));
const NotificationsPage = lazy(() => import('../pages/NotificationsPage'));

// New Redesigned User Pages
const MyRequestsPage = lazy(() => import('../pages/user/MyRequestsPageNew'));
const DisposePage = lazy(() => import('../pages/user/DisposePage'));
const AwardsPage = lazy(() => import('../pages/user/AwardsPage'));

// Collector Pages
const CollectorDashboard = lazy(() => import('../pages/collector/CollectorDashboard'));
const TicketsPage = lazy(() => import('../pages/collector/TicketsPage'));
const RoutePage = lazy(() => import('../pages/collector/RoutePage'));
const EarningsPage = lazy(() => import('../pages/collector/EarningsPage'));

const CollectorProfilePage = lazy(() => import('../pages/collector/CollectorProfilePage'));
const CollectorSettingsPage = lazy(() => import('../pages/collector/CollectorSettingsPage'));
const CollectionProductsPage = lazy(() => import('../pages/collector/CollectionProductsPage'));
const CollectionHistoryPage = lazy(() => import('../pages/collector/CollectionHistoryPage'));
const ComplaintPage = lazy(() => import('../pages/collector/ComplaintPage'));

// Government Pages
const GovernmentDashboard = lazy(() => import('../pages/government/GovernmentDashboard'));
const GovTicketsPage = lazy(() => import('../pages/government/GovTicketsPage'));
const GovCollectorsPage = lazy(() => import('../pages/government/GovCollectorsPage'));
const GovMapViewPage = lazy(() => import('../pages/government/GovMapViewPage'));
const GovReportsPage = lazy(() => import('../pages/government/GovPlaceholders').then(module => ({ default: module.GovReportsPage })));
const GovAnalyticsPage = lazy(() => import('../pages/government/GovPlaceholders').then(module => ({ default: module.GovAnalyticsPage })));
const GovRecyclersPage = lazy(() => import('../pages/government/GovPlaceholders').then(module => ({ default: module.GovRecyclersPage })));
const GovNotificationsPage = lazy(() => import('../pages/government/GovPlaceholders').then(module => ({ default: module.GovNotificationsPage })));
const GovSettingsPage = lazy(() => import('../pages/government/GovPlaceholders').then(module => ({ default: module.GovSettingsPage })));
const RequestsManagementPage = lazy(() => import('../pages/controller/RequestsManagementPage'));
const UsersManagementPage = lazy(() => import('../pages/controller/UsersManagementPage'));
const ProductsManagementPage = lazy(() => import('../pages/controller/ProductsManagementPage'));
const RequestDetailPage = lazy(() => import('../pages/controller/RequestDetailPage'));
const GiftCodesPage = lazy(() => import('../pages/controller/GiftCodesPage'));
const LogisticsPage = lazy(() => import('../pages/controller/LogisticsPage'));
const LogisticsDetailPage = lazy(() => import('../pages/controller/LogisticsDetailPage'));

const AppRoutes = () => {
    return (
        <Suspense fallback={<LoadingSpinner fullScreen />}>
            <Routes>
                {/* Public & Auth Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/recycling-guide" element={<RecyclingGuide />} />
                <Route path="/industry" element={<IndustryPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />

                {/* Protected Notifications Route */}
                <Route path="/notifications" element={
                    <ProtectedRoute>
                        <UserLayout /> {/* Reusing UserLayout for header/footer */}
                    </ProtectedRoute>
                }>
                    <Route index element={<NotificationsPage />} />
                </Route>

                {/* Dev Tools */}
                <Route path="/dev/roles" element={<RoleSwitcher />} />
                
                {/* Foundation Showcase */}
                <Route path="/dev/foundation" element={<DashboardLayout role="user" />}>
                    <Route index element={
                        <div className="space-y-6">
                            <h1 className="text-3xl font-bold text-secondary-900 mb-8">E-Suraksha UI Foundation</h1>
                            
                            <Card>
                                <CardTitle>Buttons</CardTitle>
                                <CardContent className="flex flex-wrap gap-4 mt-4">
                                    <Button variant="primary">Primary Action</Button>
                                    <Button variant="secondary">Secondary Action</Button>
                                    <Button variant="outline">Outline Button</Button>
                                    <Button variant="ghost">Ghost Button</Button>
                                    <Button variant="danger">Danger</Button>
                                    <Button variant="primary" isLoading>Loading</Button>
                                </CardContent>
                            </Card>

                            <Card hoverable>
                                <CardTitle>Hoverable Data Card</CardTitle>
                                <CardContent className="mt-4">
                                    <p className="text-secondary-600 mb-4">This card casts a deeper shadow on hover, demonstrating the micro-interactions defined in our new Tailwind configuration.</p>
                                    
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Asset ID</TableHead>
                                                <TableHead>Category</TableHead>
                                                <TableHead>Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell className="font-medium text-secondary-900">E-WST-1001</TableCell>
                                                <TableCell>Laptops</TableCell>
                                                <TableCell><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Verified</span></TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="font-medium text-secondary-900">E-WST-1002</TableCell>
                                                <TableCell>Mobiles</TableCell>
                                                <TableCell><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span></TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                    } />
                </Route>

                {/* User Routes (Wrapped in UserLayout) */}
                <Route path="/user" element={
                    <ProtectedRoute allowedRoles={['user']}>
                        <UserLayout />
                    </ProtectedRoute>
                }>
                    <Route index element={<Navigate to="home" replace />} />
                    <Route path="home" element={<UserDashboard />} />
                    <Route path="requests" element={<MyRequestsPage />} />
                    <Route path="dispose" element={<DisposePage />} />
                    <Route path="awards" element={<AwardsPage />} />

                    <Route path="rewards" element={<Navigate to="/user/awards" replace />} />
                    <Route path="rewards/:id" element={<RewardDetailPage />} />
                    <Route path="change-password" element={<ChangePasswordPage />} />
                </Route>

                {/* Collector Routes (Wrapped in CollectorLayout) */}
                <Route path="/collector" element={
                    <ProtectedRoute allowedRoles={['collector']}>
                        <CollectorLayout />
                    </ProtectedRoute>
                }>
                    <Route index element={<Navigate to="home" replace />} />
                    <Route path="home" element={<CollectorDashboard />} />
                    <Route path="tickets" element={<TicketsPage />} />
                    <Route path="route" element={<RoutePage />} />
                    <Route path="earnings" element={<EarningsPage />} />

                    <Route path="history" element={<CollectionHistoryPage />} />
                    <Route path="profile" element={<CollectorProfilePage />} />
                    <Route path="support" element={<ComplaintPage />} />
                    <Route path="settings" element={<CollectorSettingsPage />} />
                    
                    {/* Other existing routes for collector */}
                    <Route path="products" element={<CollectionProductsPage />} />
                    <Route path="complaint" element={<ComplaintPage />} />
                    <Route path="map" element={<RoutePage />} />
                    <Route path="recyclers" element={<CollectionProductsPage />} />
                    <Route path="change-password" element={<ChangePasswordPage />} />
                </Route>

                {/* Government Routes (Wrapped in GovernmentLayout) */}
                <Route path="/government" element={
                    <ProtectedRoute allowedRoles={['government']}>
                        <GovernmentLayout />
                    </ProtectedRoute>
                }>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<GovernmentDashboard />} />
                    <Route path="tickets" element={<GovTicketsPage />} />
                    <Route path="collectors" element={<GovCollectorsPage />} />
                    <Route path="map" element={<GovMapViewPage />} />
                    <Route path="reports" element={<GovReportsPage />} />
                    <Route path="analytics" element={<GovAnalyticsPage />} />
                    <Route path="recyclers" element={<GovRecyclersPage />} />
                    <Route path="notifications" element={<GovNotificationsPage />} />
                    <Route path="settings" element={<GovSettingsPage />} />
                    <Route path="change-password" element={<ChangePasswordPage />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
