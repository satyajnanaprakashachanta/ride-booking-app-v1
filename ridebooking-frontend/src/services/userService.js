import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081';

/**
 * User Service - Handles all user-related API calls
 */
class UserService {
  
  /**
   * Find or create a rider user
   */
  static async findOrCreateRider(userInfo) {
    try {
      // First, try to find existing user
      const usersResponse = await axios.get(`${API_BASE_URL}/users`);
      let riderUser = usersResponse.data.find(user => 
        user.name === userInfo.fullName && user.role === "RIDER"
      );
      
      // If user doesn't exist, create new one
      if (!riderUser) {
        const newUserResponse = await axios.post(`${API_BASE_URL}/users`, {
          name: userInfo.fullName,
          phoneNumber: userInfo.mobileNumber,
          email: `${userInfo.fullName.toLowerCase().replace(/\s+/g, '')}@rider.com`,
          role: "RIDER",
          status: "ACTIVE"
        });
        riderUser = newUserResponse.data;
      }
      
      return riderUser;
    } catch (error) {
      console.error('Error finding or creating rider:', error);
      throw new Error('Failed to process user information');
    }
  }

  /**
   * Get all users
   */
  static async getAllUsers() {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  }
}

export default UserService;
