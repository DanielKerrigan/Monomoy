
# Svelte Jupyter Widget Example

This is an updated example of using [Svelte](https://svelte.dev) in a custom Jupyter widget. It was created from [widget-ts-cookiecutter](https://github.com/jupyter-widgets/widget-ts-cookiecutter). For an older example, see [widget-svelte-cookiecutter](https://github.com/cabreraalex/widget-svelte-cookiecutter).

## Development Installation

Create a dev environment:
```bash
conda create -n monomoy -c conda-forge nodejs yarn python jupyterlab
conda activate monomoy
```

Install the Python package. This will also build the JS package.
```bash
pip install -e ".[test,examples,docs,dev]"
```

When developing your extensions, you need to manually enable your extensions with the
notebook / lab frontend. For lab, this is done by the command:

```
jupyter labextension develop --overwrite .
```

For classic notebook, you need to run:

```
jupyter nbextension install --sys-prefix --symlink --overwrite --py monomoy
jupyter nbextension enable --sys-prefix --py monomoy
```

Note that the `--symlink` flag doesn't work on Windows, so you will here have to run
the `install` command every time that you rebuild your extension. For certain installations
you might also need another flag instead of `--sys-prefix`, but we won't cover the meaning
of those flags here.

If you need to re-run `pip install -e .` at some point after running `jupyter labextension develop --overwrite .` or `jupyter nbextension install --sys-prefix --symlink --overwrite --py monomoy`, then you will either need to remove the symbolic links created by those commands or modify the install command to `pip install --ignore-installed -e .`. For lab, you can remove the symbolic links with

```
rm /Users/danielkerrigan/opt/miniconda3/envs/monomoy/share/jupyter/labextensions/monomoy
```

You will need to update this path to the `labextensions` folder based on the output of `jupyter labextension list`. For notebook, you can do that same, except replace `labextensions` with `nbextensions` in the path. Or, you can run `jupyter nbextension uninstall monomoy`.

### How to see your changes
#### Typescript:
Watch the source directory and run Jupyter lab or notebook at the same time in different
terminals to watch for changes in the extension's source and automatically rebuild the widget.

```bash
# Watch the source directory in one terminal, automatically rebuilding when needed
npm run watch
# Run JupyterLab in another terminal
jupyter lab
```

After a change wait for the build to finish and then refresh your browser and the changes should take effect.

#### Python:
If you make a change to the python code then you will need to restart the notebook kernel to have it take effect.

### VSCode Setup

The following extensions are useful when developing in [VSCode](https://code.visualstudio.com):

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode)

`.vscode/settings.json` contains modified settings for linting and formatting code. You will need to update the pylint, python, and node paths in this file.

## Updating the version

To update the version, install tbump and use it to bump the version.
By default it will also create a tag.

```bash
pip install tbump
tbump <new-version>
```
