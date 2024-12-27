import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { createWorkspaceWithBinary } from "../dist/index.js";

describe("Workspace API", () => {
	it("should process remote requests", async () => {
		const extension = process.platform === "win32" ? ".exe" : "";
		const command = resolve(
			fileURLToPath(import.meta.url),
			"../../../../..",
			`target/release/biome${extension}`,
		);

		const workspace = await createWorkspaceWithBinary(command);
		workspace.registerProjectFolder({
			setAsCurrentWorkspace: true,
		});
		await workspace.openFile({
			path: "test.js",
			content: { type: "fromClient", content: "statement()" },
			version: 0,
		});

		const printed = await workspace.formatFile({
			path: "test.js",
		});

		expect(printed.code).toBe("statement();\n");

		await workspace.closeFile({
			path: "test.js",
		});

		workspace.destroy();
	});
});
