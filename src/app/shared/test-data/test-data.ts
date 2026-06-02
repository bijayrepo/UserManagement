/**
 * Test Data for Development and Testing
 * Contains mock data for users, organizations, and authentication
 */

import { User, UserProfile, Organization, OrganizationMember, UserRole } from '../../core/models';

export class TestData {
  // ============================================
  // Sample Users
  // ============================================

  static readonly SAMPLE_USERS: Record<string, UserProfile> = {
    'user-001': {
      id: 'user-001',
      email: 'john.doe@acme.com',
      firstName: 'John',
      lastName: 'Doe',
      profilePhoto: 'https://i.pravatar.cc/150?img=1',
      phoneNumber: '+1-555-123-4567',
      organizationId: 'org-001',
      role: UserRole.ADMIN,
      department: 'Engineering',
      bio: 'Lead Software Engineer with 10+ years of experience in full-stack development',
      address: '123 Main Street',
      city: 'San Francisco',
      country: 'United States',
      zipCode: '94105',
      isActive: true,
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date('2024-01-10')
    },
    'user-002': {
      id: 'user-002',
      email: 'jane.smith@acme.com',
      firstName: 'Jane',
      lastName: 'Smith',
      profilePhoto: 'https://i.pravatar.cc/150?img=2',
      phoneNumber: '+1-555-234-5678',
      organizationId: 'org-001',
      role: UserRole.MANAGER,
      department: 'Product Management',
      bio: 'Product Manager passionate about user-centric design',
      address: '456 Oak Avenue',
      city: 'San Francisco',
      country: 'United States',
      zipCode: '94105',
      isActive: true,
      createdAt: new Date('2023-03-20'),
      updatedAt: new Date('2024-02-15')
    },
    'user-003': {
      id: 'user-003',
      email: 'mike.johnson@acme.com',
      firstName: 'Mike',
      lastName: 'Johnson',
      profilePhoto: 'https://i.pravatar.cc/150?img=3',
      phoneNumber: '+1-555-345-6789',
      organizationId: 'org-001',
      role: UserRole.USER,
      department: 'Engineering',
      bio: 'Junior Developer learning and growing in the tech field',
      address: '789 Pine Road',
      city: 'San Francisco',
      country: 'United States',
      zipCode: '94105',
      isActive: true,
      createdAt: new Date('2023-06-10'),
      updatedAt: new Date('2024-01-05')
    },
    'user-004': {
      id: 'user-004',
      email: 'sarah.williams@acme.com',
      firstName: 'Sarah',
      lastName: 'Williams',
      profilePhoto: 'https://i.pravatar.cc/150?img=4',
      phoneNumber: '+1-555-456-7890',
      organizationId: 'org-002',
      role: UserRole.MANAGER,
      department: 'Sales',
      bio: 'Sales Manager with expertise in B2B enterprise solutions',
      address: '321 Elm Street',
      city: 'New York',
      country: 'United States',
      zipCode: '10001',
      isActive: true,
      createdAt: new Date('2023-02-28'),
      updatedAt: new Date('2024-01-20')
    },
    'user-005': {
      id: 'user-005',
      email: 'david.brown@acme.com',
      firstName: 'David',
      lastName: 'Brown',
      profilePhoto: 'https://i.pravatar.cc/150?img=5',
      phoneNumber: '+1-555-567-8901',
      organizationId: 'org-002',
      role: UserRole.USER,
      department: 'Marketing',
      bio: 'Digital Marketing Specialist focused on growth strategies',
      address: '654 Maple Drive',
      city: 'New York',
      country: 'United States',
      zipCode: '10002',
      isActive: true,
      createdAt: new Date('2023-04-05'),
      updatedAt: new Date('2024-02-10')
    }
  };

  // ============================================
  // Sample Organizations
  // ============================================

  static readonly SAMPLE_ORGANIZATIONS: Record<string, Organization> = {
    'org-001': {
      id: 'org-001',
      name: 'Acme Corporation',
      description: 'A leading technology company focused on cloud solutions and digital transformation',
      logo: 'https://via.placeholder.com/100?text=Acme',
      email: 'contact@acme.com',
      phoneNumber: '+1-800-123-4567',
      address: '100 Technology Drive',
      city: 'San Francisco',
      country: 'United States',
      zipCode: '94105',
      website: 'https://www.acme.com',
      isActive: true,
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date('2024-01-15')
    },
    'org-002': {
      id: 'org-002',
      name: 'Tech Innovations Inc',
      description: 'Innovative startup building AI-powered solutions for enterprises',
      logo: 'https://via.placeholder.com/100?text=TechInn',
      email: 'hello@techinnovations.com',
      phoneNumber: '+1-888-555-6666',
      address: '200 Enterprise Avenue',
      city: 'New York',
      country: 'United States',
      zipCode: '10001',
      website: 'https://www.techinnovations.com',
      isActive: true,
      createdAt: new Date('2021-06-15'),
      updatedAt: new Date('2024-02-20')
    },
    'org-003': {
      id: 'org-003',
      name: 'Global Solutions Ltd',
      description: 'International consulting firm providing business transformation services',
      logo: 'https://via.placeholder.com/100?text=GlobSol',
      email: 'info@globalsolutions.com',
      phoneNumber: '+1-877-777-8888',
      address: '300 Business Park Road',
      city: 'Boston',
      country: 'United States',
      zipCode: '02101',
      website: 'https://www.globalsolutions.com',
      isActive: true,
      createdAt: new Date('2019-03-20'),
      updatedAt: new Date('2024-01-25')
    }
  };

  // ============================================
  // Sample Organization Members
  // ============================================

  static readonly SAMPLE_MEMBERS: OrganizationMember[] = [
    // Acme Corporation Members
    {
      id: 'member-001',
      userId: 'user-001',
      organizationId: 'org-001',
      role: 'admin',
      joinedAt: new Date('2023-01-15')
    },
    {
      id: 'member-002',
      userId: 'user-002',
      organizationId: 'org-001',
      role: 'manager',
      joinedAt: new Date('2023-03-20')
    },
    {
      id: 'member-003',
      userId: 'user-003',
      organizationId: 'org-001',
      role: 'user',
      joinedAt: new Date('2023-06-10')
    },
    // Tech Innovations Members
    {
      id: 'member-004',
      userId: 'user-004',
      organizationId: 'org-002',
      role: 'manager',
      joinedAt: new Date('2023-02-28')
    },
    {
      id: 'member-005',
      userId: 'user-005',
      organizationId: 'org-002',
      role: 'user',
      joinedAt: new Date('2023-04-05')
    }
  ];

  // ============================================
  // Authentication Test Cases
  // ============================================

  static readonly TEST_CREDENTIALS = [
    {
      email: 'john.doe@acme.com',
      password: 'password123',
      userId: 'user-001',
      description: 'Admin user - Full access'
    },
    {
      email: 'jane.smith@acme.com',
      password: 'password123',
      userId: 'user-002',
      description: 'Manager user - Department access'
    },
    {
      email: 'mike.johnson@acme.com',
      password: 'password123',
      userId: 'user-003',
      description: 'Regular user - Basic access'
    },
    {
      email: 'sarah.williams@acme.com',
      password: 'password123',
      userId: 'user-004',
      description: 'Manager in different organization'
    },
    {
      email: 'any@example.com',
      password: 'anypassword',
      userId: 'user-001',
      description: 'Any credentials work (mock API)'
    }
  ];

  // ============================================
  // Test Scenarios
  // ============================================

  static readonly TEST_SCENARIOS = {
    basicLogin: {
      email: 'john.doe@acme.com',
      password: 'password123',
      expectedUser: 'user-001'
    },
    adminUser: {
      email: 'john.doe@acme.com',
      password: 'password123',
      expectedRole: 'admin',
      expectedOrg: 'org-001'
    },
    multipleOrganizations: {
      orgs: ['org-001', 'org-002', 'org-003'],
      userCounts: [3, 2, 0]
    },
    roleHierarchy: {
      admin: ['user-001'],
      manager: ['user-002', 'user-004'],
      user: ['user-003', 'user-005']
    }
  };

  // ============================================
  // Helper Methods
  // ============================================

  /**
   * Get a sample user by ID
   */
  static getSampleUser(userId: string): UserProfile | undefined {
    return this.SAMPLE_USERS[userId];
  }

  /**
   * Get all sample users
   */
  static getAllSampleUsers(): UserProfile[] {
    return Object.values(this.SAMPLE_USERS);
  }

  /**
   * Get users by organization
   */
  static getUsersByOrganization(orgId: string): UserProfile[] {
    return this.getAllSampleUsers().filter(user => user.organizationId === orgId);
  }

  /**
   * Get a sample organization by ID
   */
  static getSampleOrganization(orgId: string): Organization | undefined {
    return this.SAMPLE_ORGANIZATIONS[orgId];
  }

  /**
   * Get all sample organizations
   */
  static getAllSampleOrganizations(): Organization[] {
    return Object.values(this.SAMPLE_ORGANIZATIONS);
  }

  /**
   * Get members by organization
   */
  static getMembersByOrganization(orgId: string): OrganizationMember[] {
    return this.SAMPLE_MEMBERS.filter(member => member.organizationId === orgId);
  }

  /**
   * Get a random sample user
   */
  static getRandomUser(): UserProfile {
    const users = this.getAllSampleUsers();
    return users[Math.floor(Math.random() * users.length)];
  }

  /**
   * Generate test user update data
   */
  static generateUserUpdate(): Partial<UserProfile> {
    return {
      phoneNumber: '+1-555-999-8888',
      city: 'Los Angeles',
      country: 'United States',
      zipCode: '90001',
      bio: 'Updated bio for testing purposes',
      address: '999 Test Avenue'
    };
  }

  /**
   * Generate test organization update data
   */
  static generateOrgUpdate(): Partial<Organization> {
    return {
      phoneNumber: '+1-800-999-9999',
      email: 'newemail@acme.com',
      city: 'Seattle',
      country: 'United States',
      zipCode: '98101',
      description: 'Updated organization description for testing'
    };
  }
}

// ============================================
// Export Convenience Functions
// ============================================

export function getTestUser(userId: string): UserProfile | undefined {
  return TestData.getSampleUser(userId);
}

export function getAllTestUsers(): UserProfile[] {
  return TestData.getAllSampleUsers();
}

export function getTestOrganization(orgId: string): Organization | undefined {
  return TestData.getSampleOrganization(orgId);
}

export function getAllTestOrganizations(): Organization[] {
  return TestData.getAllSampleOrganizations();
}

export function getTestCredentials() {
  return TestData.TEST_CREDENTIALS;
}

export function getTestScenarios() {
  return TestData.TEST_SCENARIOS;
}
