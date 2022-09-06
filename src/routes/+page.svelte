<script lang="ts">
	import { copyTextToClipboard } from './clipboard';
	import { droptext } from './droptext';

	let inputData = ''; // @hmr:keep;
	let outputData = '';

	let copiedMsg = false;

	function convert(inputData: string) {
		let lines: string[] = [];
		let fields = {} as any;

		// loop through each line in the input data
		for (let line of inputData.replace(/(\r\n)|\r|\n/g, '\n').split(/\n+/g)) {
			line = line.trim();
			if (line.length === 0) {
				continue;
			}
			if (line.includes(': ')) {
				// example: Konto: 91680020
				const pos = line.indexOf(': ');
				const key = line.substring(0, pos);
				const value = line.substring(pos + 2);
				fields[key] = value.replace('\t', ' ');
			} else {
				// example: 16.08.2022 - 19:06:19
				fields['Datum'] = line;
				lines.push(convertRowToString(fields));
				fields = {};
			}
		}

		return lines.join('\n');
	}

	function convertRowToString(row: Record<string, string>) {
		return `${row.Datum ?? ''}\t${row.Benutzer ?? ''}\t${row.Konto ?? ''}\t${
			row.Beschreibung ?? ''
		}\t${row.Betrag.substring(0, row.Betrag.length - 2) ?? ''}`;
	}

	function copyOutput() {
		copyTextToClipboard(outputData);
		copiedMsg = true;
		setTimeout(() => (copiedMsg = false), 5000);
	}
</script>

<h1>Konverter</h1>

<h2>Kopiere Text hier hinein oder ziehe die Datei in das Textfeld:</h2>

<textarea
	bind:value={inputData}
	placeholder="Bitte Text hineinkopieren"
	rows="20"
	use:droptext
	on:droppedtext={(e) => (inputData = e.detail.text)}
/><br />
<button on:click={() => (outputData = convert(inputData))}>Konvertieren</button>
<h2>Ergebnis:</h2>
<textarea bind:value={outputData} readonly rows="20" /><br />
<button on:click={copyOutput}>Kopieren</button>{#if copiedMsg}Kopiert!{/if}

<style>
	textarea {
		width: 80%;
		height: 100%;
		padding: 25px;
		border: 8px outset lightgrey;
		border-radius: 8px;
		background-color: darkgrey;
		font-family: monospace;
		font-size: 1.2em;
	}
	button {
		margin-top: 10px;
		margin-right: 10px;
		padding: 10px;
		border: 2px outset lightgrey;
		border-radius: 6px;
	}
	:global(body) {
		background-color: rgb(41, 41, 41);
		color: rgb(188, 188, 188);
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
		margin-left: 15px;
	}
</style>
