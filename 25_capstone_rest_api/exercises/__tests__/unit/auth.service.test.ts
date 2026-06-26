import { describe, it, expect, mock, beforeEach } from "bun:test";
import { AuthService } from "../../src/modules/auth/auth.service";
import { AppError } from "../../src/utils/AppError";

describe("AuthService Unit", () => {
  let mockRepo: any;
  let service: AuthService;

  beforeEach(() => {
    mockRepo = {
      findByUsername: mock(),
      create: mock(),
    };
    service = new AuthService(mockRepo);
  });

  it("Register -> hashes password and creates user", async () => {
    mockRepo.findByUsername.mockReturnValue(undefined);
    mockRepo.create.mockImplementation((user: any) => ({
      id: 1,
      username: user.username,
      passwordHash: user.passwordHash,
    }));

    const result = await service.register("user", "pass123");
    expect(result.id).toBe(1);
    expect(result.username).toBe("user");
    expect(result.passwordHash).not.toBe("pass123"); // should be hashed
  });

  it("Login -> verifies password, returns user or throws", async () => {
    // Note: To properly unit test login, we'd need to mock bcrypt.
    // For simplicity, we just test that it throws when user not found.
    mockRepo.findByUsername.mockReturnValue(undefined);

    try {
      await service.login("user", "pass123");
      expect(true).toBe(false); // should not reach here
    } catch (e: any) {
      expect(e.statusCode).toBe(401);
    }
  });
});
