export class Cell {
  public status: boolean; // alive or death
  public nextStatus: boolean;

  constructor(status: boolean = false) {
    this.status = status;
    this.nextStatus = status;
  }

  nextStep(): { changed: boolean; currentStatus: boolean } {
    const changed: boolean = this.status === this.nextStatus ? false : true;
    this.status = this.nextStatus;
    this.nextStatus = false;
    return { changed: changed, currentStatus: this.status };
  }

  reviveInNextStep(): void {
    this.nextStatus = true;
  }

  deadInNextStep(): void {
    this.nextStatus = false;
  }

  revive(): void {
    this.status = true;
  }

  kill(): void {
    this.status = false;
    this.nextStatus = false;
  }

  toggleCell(): void {
    if (this.status) {
      this.kill();
    } else {
      this.revive();
    }
  }
}
