class BannerPlugin {
	constructor() {
		this.banners = [];
	}
	pushBanner(compiler, banner, tapOptions) {
		compiler.hooks.compilation.tap(tapOptions, compilation => {
			this.banners.push(`/* ${banner} */`);
		});
	}
	apply(compiler) {
		this.pushBanner(compiler, "banner1", { name: "banner1", stage: 100 });
		this.pushBanner(compiler, "banner2", {
			name: "banner2",
			before: "banner1"
		});
		this.pushBanner(compiler, "banner3", { name: "banner3", stage: -100 });
		this.pushBanner(compiler, "banner4", { name: "banner4" });
		compiler.hooks.compilation.tap("apply banner", compilation => {
			compilation.hooks.processAssets.tap(
				{
					name: "BannerPlugin",
					// ProcessAssetsStageAdditions
					stage: -100
				},
				assets => {
					for (const file of Object.keys(assets)) {
						compilation.updateAsset(file, old => {
							const newContent = `${this.banners.join("\n")}\n${old.source().toString()}`;
							return new compiler.webpack.sources.RawSource(newContent);
						});
					}
				}
			);
		});
	}
}

module.exports = {
	plugins: [new BannerPlugin()]
};