import { joinPathFragments, readProjectConfiguration, Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Linter } from '@nx/linter';
import { libraryGenerator, storybookConfigurationGenerator } from '@nx/react';
import generator from './generator';

describe('component generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('create react component and unit & e2e test + story', async () => {
    await libraryGenerator(tree, {
      name: 'ui-lib',
      linter: Linter.EsLint,
      skipFormat: false,
      skipTsConfig: false,
      style: 'none',
      unitTestRunner: 'jest',
    });

    await storybookConfigurationGenerator(tree, {
      configureCypress: true,
      name: 'ui-lib',
    });

    await generator(tree, {
      name: 'data-table',
      project: 'ui-lib',
    });

    const { sourceRoot } = readProjectConfiguration(tree, 'ui-lib');
    const { sourceRoot: e2eSourceRoot } = readProjectConfiguration(
      tree,
      'ui-lib-e2e'
    );

    expect(
      tree.exists(joinPathFragments(sourceRoot, 'lib/data-table/DataTable.tsx'))
    ).toBe(true);

    expect(
      tree.exists(
        joinPathFragments(sourceRoot, 'lib/data-table/DataTable.spec.tsx')
      )
    ).toBe(true);

    expect(
      tree.exists(
        joinPathFragments(sourceRoot, 'lib/data-table/DataTable.stories.tsx')
      )
    ).toBe(true);
  });
});
