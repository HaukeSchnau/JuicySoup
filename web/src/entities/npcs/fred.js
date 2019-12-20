import Npc from "./npc";
import fredImg from "../../assets/fred.png";

class Fred extends Npc {
  constructor(map, initialPos) {
    super(map, Fred.sprites, initialPos, 1, 1.5, 50, 0.002, [
      "Yabba Dabba Doo!! Du hast mich vor diesen Säbelzahntigern und den Mammut gerettet. Wer bist du überhaupt?",
      "Echt? Du bist aus der Zukunft? Ach wenn du schon mal hier bist kann ich dir auch was über die Steinzeit erzählen.",
      "Die Steinzeit ist die früheste Epoche der Menschheitsgeschichte. Sie ist durch erhalten gebliebenes Steingerät gekennzeichnet und begann – nach heutigem Forschungsstand – mit den ältesten als gesichert geltenden Werkzeugen der Oldowan-Kultur vor 2,6 Millionen Jahren.[1] Als Produzenten von Steingeräten gelten die frühen, nur fossil überlieferten Menschen-Arten Homo rudolfensis und Homo habilis sowie alle späteren wie zum Beispiel Homo ergaster / Homo erectus, die Neandertaler und auch der anatomisch moderne Mensch (Homo sapiens).",
      "Die Bezeichnung Steinzeit wurde 1836 von Christian Jürgensen Thomsen mit dem Dreiperiodensystem eingeführt, als er die Urgeschichte Dänemarks nach vorrangig genutzten Werkstoffen für Werkzeuge, Waffen und Schmuck in Steinzeit, Bronzezeit und Eisenzeit gliederte. Die Steinzeit Europas wird heute zusätzlich unterteilt in Altsteinzeit, Mittelsteinzeit und Jungsteinzeit. Für Afrika südlich der Sahara gibt es eine eigene Gliederung der Epoche, bestehend aus Early Stone Age, Middle Stone Age und Later Stone Age, die von den für Europa gültigen Zeitabschnitten abweicht.",
      "Ans Ende der Steinzeit wird, zeitlich regional sehr unterschiedlich, aber stets beginnend mit dem Aufkommen des Werkstoffs Kupfer, die Kupfersteinzeit gestellt. Erst mit der frühen Bronzezeit wird die Steinzeit in einigen Regionen der Welt abgelöst, in Mitteleuropa etwa um 2200 v. Chr.",
      "Und meinen Speer hast du mir auch wieder gebracht. Danke. Ich muss jetzt los und du auch na dann Yabba Dabba Doo!!!!!"
    ]);
    this.type = "fred";
  }
}

Fred.preload = () => {
  Fred.sprites = [loadImage(fredImg)];
};

export default Fred;
